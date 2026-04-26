const NORMALIZED_CATEGORIES = [
  "Clothing",
  "Feeding",
  "Diapers",
  "Sleep",
  "Transportation",
  "Safety",
  "Bathing",
  "Play",
  "Books",
  "Gear",
  "Nursing",
  "Postpartum",
  "Health",
  "Toddler Essentials",
  "Other",
];

const TAG_TO_CATEGORY_HINTS = {
  stroller: "Transportation",
  "car seat": "Safety",
  crib: "Sleep",
  cribs: "Sleep",
  bassinet: "Sleep",
  blanket: "Sleep",
  blankets: "Sleep",
  bottles: "Feeding",
  bottle: "Feeding",
  feeding: "Feeding",
  diapers: "Diapers",
  diaper: "Diapers",
  wipes: "Diapers",
  onesies: "Clothing",
  clothing: "Clothing",
  clothes: "Clothing",
  "baby tub": "Bathing",
  toys: "Play",
  books: "Books",
  pump: "Nursing",
};

const RELATED_CATEGORY_MAP = {
  Transportation: ["Safety", "Gear"],
  Feeding: ["Diapers", "Nursing"],
  Sleep: ["Clothing", "Gear"],
  Diapers: ["Bathing", "Clothing"],
  Clothing: ["Sleep", "Diapers"],
  Safety: ["Transportation", "Gear"],
};

function toTitleCase(value = "") {
  return String(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeCategory(rawCategory = "") {
  const normalized = toTitleCase(rawCategory);
  if (normalized === "Cribs" || normalized === "Blankets") return "Sleep";
  if (!normalized) return "Other";
  return NORMALIZED_CATEGORIES.includes(normalized) ? normalized : "Other";
}

function getChildAgeMonths(user) {
  const onboarding = user.onboarding || {};
  const childAgeValue = Number(onboarding.childAgeValue || 0);
  const childAgeUnit = onboarding.childAgeUnit || "";

  if (!childAgeValue) return null;
  if (childAgeUnit === "months") return childAgeValue;
  if (childAgeUnit === "weeks") return Math.max(0, Math.round(childAgeValue / 4));
  if (childAgeUnit === "years") return childAgeValue * 12;
  return null;
}

function getUserStage(user) {
  const onboarding = user.onboarding || {};
  const pregnantWeeks = Number(onboarding.pregnantWeeks || 0);
  const postpartumWeeks = Number(onboarding.postpartumWeeks || 0);
  const childAgeMonths = getChildAgeMonths(user);

  if (pregnantWeeks > 0) {
    return { type: "pregnant", referenceAgeMonths: 0 };
  }
  if (postpartumWeeks > 0) {
    return {
      type: "postpartum",
      referenceAgeMonths: Math.max(0, Math.round(postpartumWeeks / 4)),
    };
  }
  if (childAgeMonths !== null) {
    return { type: "child-age-known", referenceAgeMonths: childAgeMonths };
  }
  return { type: "unknown", referenceAgeMonths: null };
}

function itemFitsStage(user, item) {
  const { referenceAgeMonths } = getUserStage(user);
  if (referenceAgeMonths === null) return true;
  return (
    referenceAgeMonths >= Number(item.minAgeMonths || 0) &&
    referenceAgeMonths <= Number(item.maxAgeMonths || 999)
  );
}

function getAgeFitReason(user, item) {
  const { referenceAgeMonths } = getUserStage(user);
  if (referenceAgeMonths === null) return "stage fit unknown";
  if (referenceAgeMonths < item.minAgeMonths) return "better for an older child";
  if (referenceAgeMonths > item.maxAgeMonths) return "better for a younger child";
  return `good fit for about ${referenceAgeMonths} months`;
}

function normalizeNeedTags(user) {
  const rawTags = user?.onboarding?.needTags || [];
  return rawTags.map((rawTag) => {
    const normalizedRawTag = String(rawTag || "").toLowerCase().trim();
    const mapped = Object.entries(TAG_TO_CATEGORY_HINTS).find(([key]) =>
      normalizedRawTag.includes(key)
    );
    const category = mapped
      ? mapped[1]
      : normalizeCategory(rawTag) || "Other";
    return {
      rawTag,
      category,
      reason: mapped
        ? `Mapped from tag "${rawTag}" to ${category}.`
        : `Using "${rawTag}" as ${category}.`,
    };
  });
}

function inferRelatedCategories(directCategories) {
  const directSet = new Set(directCategories);
  const inferred = [];
  directCategories.forEach((category) => {
    const related = RELATED_CATEGORY_MAP[category] || [];
    related.forEach((relatedCategory) => {
      if (!directSet.has(relatedCategory) && !inferred.some((x) => x.category === relatedCategory)) {
        inferred.push({
          category: relatedCategory,
          displayLabel: relatedCategory,
          reason: `People looking for ${category} often also need ${relatedCategory}.`,
        });
      }
    });
  });
  return inferred.slice(0, 4);
}

function scoreItemForUser(user, item, directCategories = [], inferredCategories = []) {
  const itemCategory = normalizeCategory(item.category);
  let score = 0;
  const reasons = [];

  if (directCategories.includes(itemCategory)) {
    score += 5;
    reasons.push(`matches your selected need: ${itemCategory}`);
  }
  if (inferredCategories.includes(itemCategory)) {
    score += 3;
    reasons.push(`related category suggestion: ${itemCategory}`);
  }

  if (itemFitsStage(user, item)) {
    score += 4;
  } else {
    score -= 3;
  }
  reasons.push(getAgeFitReason(user, item));

  if (item.condition === "new") {
    score += 1;
    reasons.push("new condition");
  } else if (item.condition === "used-good") {
    score += 0.5;
    reasons.push("good condition");
  }

  if (item.location === "nearby") {
    score += 1;
    reasons.push("available nearby");
  }

  return { ...item, category: itemCategory, score, reasons };
}

function rankItems(user, items, directCategories, inferredCategories) {
  return items
    .map((item) => scoreItemForUser(user, item, directCategories, inferredCategories))
    .sort((a, b) => b.score - a.score);
}

function pickSectionItems(scoredItems, allowedCategories, limit = 6) {
  const filtered = scoredItems
    .filter((item) => allowedCategories.includes(item.category))
    .filter((item) => item.score >= 3);
  return (filtered.length ? filtered : scoredItems.filter((item) => allowedCategories.includes(item.category))).slice(
    0,
    limit
  );
}

function buildRecommendationsPayload(user, items) {
  const normalizedNeeds = normalizeNeedTags(user);
  const directCategories = [...new Set(normalizedNeeds.map((entry) => entry.category))];
  const inferred = inferRelatedCategories(directCategories);
  const inferredCategories = inferred.map((entry) => entry.category);
  const scored = rankItems(user, items, directCategories, inferredCategories);

  let lookingForItems = pickSectionItems(scored, directCategories, 6);
  let recommendedItems = pickSectionItems(scored, inferredCategories, 6);

  // If onboarding tags are empty, still show best available matches.
  if (directCategories.length === 0 && inferredCategories.length === 0) {
    lookingForItems = scored.slice(0, 6);
    recommendedItems = [];
  }

  const stage = getUserStage(user);
  const summary = `Based on your selected needs and ${
    stage.referenceAgeMonths === null
      ? "current caregiving stage"
      : `child stage around ${stage.referenceAgeMonths} months`
  }, we prioritized direct matches first and then related categories.`;

  const insights = [
    "Direct matches are prioritized from your onboarding need tags.",
    "Age/stage fit is used to avoid items that are too early or too late.",
    "Related categories are suggested based on common bundled needs.",
  ];

  return {
    summary,
    normalizedNeeds,
    lookingFor: {
      categories: directCategories,
      items: lookingForItems,
    },
    recommended: {
      categories: inferred,
      items: recommendedItems,
    },
    insights,
  };
}

function getRecommendations(user, items) {
  const payload = buildRecommendationsPayload(user, items);
  return [...payload.lookingFor.items, ...payload.recommended.items]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

module.exports = {
  NORMALIZED_CATEGORIES,
  TAG_TO_CATEGORY_HINTS,
  RELATED_CATEGORY_MAP,
  getChildAgeMonths,
  getUserStage,
  itemFitsStage,
  scoreItemForUser,
  getRecommendations,
  buildRecommendationsPayload,
};