const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    donorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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

    text: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      default: "",
    },
    declaredBrand: {
      type: String,
      default: "",
    },
    declaredYear: {
      type: String,
      default: "",
    },

    itemName: {
      type: String,
      default: "",
    },
    detectedBrand: {
      type: String,
      default: "",
    },
    detectedModel: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "other",
    },
    isRelevant: {
      type: Boolean,
      default: false,
    },
    stageFit: {
      type: [String],
      default: [],
    },
    aiCondition: {
      type: String,
      default: "",
    },
    conditionTags: {
      type: [String],
      default: [],
    },

    descriptionMatch: {
      type: Boolean,
      default: false,
    },
    brandMatch: {
      type: Boolean,
      default: false,
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    mismatchReason: {
      type: String,
      default: "",
    },

    needsReview: {
      type: Boolean,
      default: false,
    },
    reviewReason: {
      type: String,
      default: "",
    },
    confidence: {
      type: Number,
      default: 0,
    },

    recall: {
      recallStatus: { type: String, default: "" },
      recallCount: { type: Number, default: 0 },
      recallQuery: { type: String, default: "" },
      recallTitle: { type: String, default: "" },
      recallDescription: { type: String, default: "" },
    },

    finalStatus: {
      type: String,
      default: "",
    },
    finalReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);