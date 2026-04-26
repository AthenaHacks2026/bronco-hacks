const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const RecommendationSnapshot = require("../models/RecommendationSnapshot");
const {
  getRecommendations,
  buildRecommendationsPayload,
} = require("../services/recommender");
const {
  enhanceRecommendationsWithGemini,
} = require("../services/gemini-recommend");

function toStringArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => {
      if (typeof value === "string") return value.trim();
      if (value && typeof value === "object") {
        return (
          value.displayLabel ||
          value.category ||
          value.rawTag ||
          value.label ||
          ""
        )
          .toString()
          .trim();
      }
      return "";
    })
    .filter(Boolean);
}

function buildProfileSignature(user) {
  return {
    userType: user?.onboarding?.userType || "",
    caregiverType: user?.onboarding?.caregiverType || "",
    pregnantWeeks: user?.onboarding?.pregnantWeeks || "",
    postpartumWeeks: user?.onboarding?.postpartumWeeks || "",
    childAgeValue: user?.onboarding?.childAgeValue || "",
    childAgeUnit: user?.onboarding?.childAgeUnit || "",
    needTags: toStringArray(user?.onboarding?.needTags),
  };
}

function needsSnapshotRefresh(user, snapshot) {
  if (!snapshot) return true;

  const completedAt = user?.onboarding?.completedAt
    ? new Date(user.onboarding.completedAt).getTime()
    : null;
  const snapshotCreatedAt = snapshot?.createdAt
    ? new Date(snapshot.createdAt).getTime()
    : null;

  if (!completedAt || !snapshotCreatedAt) return false;
  return snapshotCreatedAt < completedAt;
}

function applySnapshotToPayload(basePayload, snapshot) {
  if (!snapshot) return basePayload;

  return {
    ...basePayload,
    summary: snapshot.summary || basePayload.summary,
    normalizedNeeds:
      Array.isArray(snapshot.normalizedNeeds) && snapshot.normalizedNeeds.length > 0
        ? snapshot.normalizedNeeds.map((category) => ({
            rawTag: category,
            category,
            reason: "Loaded from saved recommendation snapshot.",
          }))
        : basePayload.normalizedNeeds,
    recommended: {
      ...basePayload.recommended,
      categories:
        Array.isArray(snapshot.recommendedCategories) &&
        snapshot.recommendedCategories.length > 0
          ? snapshot.recommendedCategories
          : basePayload.recommended.categories,
    },
  };
}

function normalizeDbItem(item) {
  const image =
    item?.imageUrl ||
    item?.photoUrl ||
    item?.image ||
    (Array.isArray(item?.images) && item.images.length > 0 ? item.images[0] : "");

  return {
    id: String(item._id),
    title: item.title || item.itemName || item.text || "Donated item",
    category: item.category || "Gear",
    description: item.description || item.text || "",
    image,
    condition: item.condition || "used-good",
    minAgeMonths: Number.isFinite(item.minAgeMonths) ? item.minAgeMonths : 0,
    maxAgeMonths: Number.isFinite(item.maxAgeMonths) ? item.maxAgeMonths : 999,
    location:
      item?.location?.zip ||
      item?.location?.city ||
      item?.location?.state ||
      "unknown",
  };
}

// auth middleware sets req.userId
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dbItems = await Item.find({
      $or: [
        { status: "available" },
        { status: { $regex: /^available$/i } },
        { status: { $exists: false } },
        { status: null },
      ],
    }).lean();
    const sourceItems = dbItems.map(normalizeDbItem);

    const profileSignature = buildProfileSignature(user);
    const latestSnapshot = await RecommendationSnapshot.findOne({
      caregiverUserId: user._id,
      "basedOnProfile.userType": profileSignature.userType,
      "basedOnProfile.caregiverType": profileSignature.caregiverType,
      "basedOnProfile.pregnantWeeks": profileSignature.pregnantWeeks,
      "basedOnProfile.postpartumWeeks": profileSignature.postpartumWeeks,
      "basedOnProfile.childAgeValue": profileSignature.childAgeValue,
      "basedOnProfile.childAgeUnit": profileSignature.childAgeUnit,
      "basedOnProfile.needTags": profileSignature.needTags,
    }).sort({ createdAt: -1 });

    const basePayload = buildRecommendationsPayload(user, sourceItems);
    const shouldRefreshSnapshot = needsSnapshotRefresh(user, latestSnapshot);
    const payload = shouldRefreshSnapshot
      ? await enhanceRecommendationsWithGemini(user, basePayload)
      : applySnapshotToPayload(basePayload, latestSnapshot);
    const recommendations = getRecommendations(user, sourceItems);

    if (shouldRefreshSnapshot) {
      const snapshotItemIds = []
        .concat(payload?.lookingFor?.items || [], payload?.recommended?.items || [])
        .map((item) => item?.id)
        .filter((id) => /^[a-f0-9]{24}$/i.test(String(id)))
        .map((id) => id);

      // Snapshot writes should never break serving recommendations.
      RecommendationSnapshot.create({
        caregiverUserId: user._id,
        basedOnProfile: profileSignature,
        normalizedNeeds: toStringArray(payload?.normalizedNeeds),
        recommendedCategories: toStringArray(payload?.recommended?.categories),
        recommendedItemIds: snapshotItemIds,
        summary: payload?.summary || "",
        source: "db",
      }).catch((snapshotError) => {
        console.warn("Failed to store recommendation snapshot:", snapshotError.message);
      });
    }

    res.json({
      ...payload,
      // keep backward compatibility with existing frontend consumers
      recommendations,
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

module.exports = router;