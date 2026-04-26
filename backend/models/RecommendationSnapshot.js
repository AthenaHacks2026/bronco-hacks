const mongoose = require("mongoose");

const recommendationSnapshotSchema = new mongoose.Schema(
  {
    caregiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    basedOnProfile: {
      userType: { type: String, default: "" },
      caregiverType: { type: String, default: "" },
      pregnantWeeks: { type: String, default: "" },
      postpartumWeeks: { type: String, default: "" },
      childAgeValue: { type: String, default: "" },
      childAgeUnit: { type: String, default: "" },
      needTags: { type: [String], default: [] },
    },
    normalizedNeeds: {
      type: [String],
      default: [],
    },
    recommendedCategories: {
      type: [String],
      default: [],
    },
    recommendedItemIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Item",
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["db", "mock"],
      default: "db",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "RecommendationSnapshot",
  recommendationSnapshotSchema
);
