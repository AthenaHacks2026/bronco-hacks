const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    onboarding: {
      userType: {
        type: String,
        enum: ["caregiver", "donor", "both", null],
        default: null,
      },
      donorInfo: {
        location: { type: String, default: null },
        streetAddress: { type: String, default: null },
        phone: { type: String, default: null },
      },
      caregiverType: {
        type: String,
        enum: ["pregnant", "postpartum", "other", null],
        default: null,
      },
      pregnantWeeks: { type: String, default: null },
      postpartumWeeks: { type: String, default: null },
      childAgeValue: { type: String, default: null },
      childAgeUnit: {
        type: String,
        enum: ["weeks", "years", null],
        default: null,
      },
      needsConfidence: {
        type: String,
        enum: ["know", "unsure", null],
        default: null,
      },
      needTags: {
        type: [String],
        default: [],
      },
      completedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
