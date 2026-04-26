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

function normalizeDbItem(item) {
  return {
    id: String(item._id),
    title: item.title || item.itemName || item.text || "Donated item",
    category: item.category || "Gear",
    description: item.description || item.text || "",
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

    const basePayload = buildRecommendationsPayload(user, sourceItems);
    const payload = await enhanceRecommendationsWithGemini(user, basePayload);
    const recommendations = getRecommendations(user, sourceItems);

    const snapshotItemIds = []
      .concat(payload?.lookingFor?.items || [], payload?.recommended?.items || [])
      .map((item) => item?.id)
      .filter((id) => /^[a-f0-9]{24}$/i.test(String(id)))
      .map((id) => id);

    // Snapshot writes should never break serving recommendations.
    RecommendationSnapshot.create({
      caregiverUserId: user._id,
      basedOnProfile: {
        userType: user?.onboarding?.userType || "",
        caregiverType: user?.onboarding?.caregiverType || "",
        pregnantWeeks: user?.onboarding?.pregnantWeeks || "",
        postpartumWeeks: user?.onboarding?.postpartumWeeks || "",
        childAgeValue: user?.onboarding?.childAgeValue || "",
        childAgeUnit: user?.onboarding?.childAgeUnit || "",
        needTags: user?.onboarding?.needTags || [],
      },
      normalizedNeeds: payload?.normalizedNeeds || [],
      recommendedCategories: payload?.recommended?.categories || [],
      recommendedItemIds: snapshotItemIds,
      summary: payload?.summary || "",
      source: "db",
    }).catch((snapshotError) => {
      console.warn("Failed to store recommendation snapshot:", snapshotError.message);
    });

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