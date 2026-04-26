function applySafetyRules(parsed, recallResult) {
  const blockedTags = ["expired"];
  const seriousReviewTags = [
    "missing_part",
    "loose_part",
    "damaged",
    "safety_concern",
  ];

  if (recallResult?.recall_status === "possible_match") {
    return {
      final_status: "blocked",
      final_reason:
        "Possible recall match found. Item should not be listed until reviewed.",
    };
  }

  if (!parsed.is_relevant) {
    return {
      final_status: "needs_review",
      final_reason: "Item not relevant to maternity or infant care.",
    };
  }

  if (parsed.condition_tags.some((tag) => blockedTags.includes(tag))) {
    return {
      final_status: "blocked",
      final_reason: "Item is expired and unsafe.",
    };
  }

  if (parsed.condition_tags.some((tag) => seriousReviewTags.includes(tag))) {
    return {
      final_status: "needs_review",
      final_reason: parsed.review_reason || "Manual review required.",
    };
  }

  if (parsed.needs_review) {
    return {
      final_status: "needs_review",
      final_reason: parsed.review_reason || "Manual review required.",
    };
  }

  if (parsed.confidence < 0.7) {
    return {
      final_status: "needs_review",
      final_reason: "Low confidence result. Manual review required.",
    };
  }

  // Approve safe used items if AI says they are in good condition
  if (
    parsed.condition === "used_good" ||
    parsed.condition === "like_new" ||
    parsed.condition === "new"
  ) {
    return {
      final_status: "approved",
      final_reason: "Item passed safety checks.",
    };
  }

  return {
    final_status: "needs_review",
    final_reason: "Manual review required.",
  };
}