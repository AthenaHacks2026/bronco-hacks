const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    condition: String,
    declaredBrand: String,
    declaredYear: String,

    itemName: String,
    detectedBrand: String,
    detectedModel: String,
    category: String,
    isRelevant: Boolean,
    stageFit: [String],

    conditionTags: [String],
    needsReview: Boolean,
    reviewReason: String,
    confidence: Number,

    recall: {
      recallStatus: String,
      recallCount: Number,
      recallQuery: String,
      recallTitle: String,
      recallDescription: String,
    },

    finalStatus: String,
    finalReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);