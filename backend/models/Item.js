const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    // Core inventory ownership field for real listings.
    donorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Backward compatibility for older records created before donorUserId.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    rawTags: {
      type: [String],
      default: [],
    },
    minAgeMonths: {
      type: Number,
      default: 0,
    },
    maxAgeMonths: {
      type: Number,
      default: 999,
    },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "reserved", "claimed", "removed"],
      default: "available",
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
    aiCondition: String,
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