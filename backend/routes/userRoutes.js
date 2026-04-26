const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const normalizeNullableEnum = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

const normalizeOnboardingPayload = (onboarding = {}) => ({
  ...onboarding,
  userType: normalizeNullableEnum(onboarding.userType),
  caregiverType: normalizeNullableEnum(onboarding.caregiverType),
  childAgeUnit: normalizeNullableEnum(onboarding.childAgeUnit),
  needsConfidence: normalizeNullableEnum(onboarding.needsConfidence),
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name email onboarding createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user profile.",
      error: error.message,
    });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const { name, email, onboarding } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: "Name cannot be empty." });
      }
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({ message: "Email cannot be empty." });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email is already in use." });
      }

      user.email = normalizedEmail;
    }

    if (onboarding && typeof onboarding === "object") {
      const normalizedOnboarding = normalizeOnboardingPayload(onboarding);

      user.onboarding = {
        ...(user.onboarding?.toObject?.() || user.onboarding || {}),
        ...normalizedOnboarding,
      };
    }

    await user.save();

    const updatedUser = await User.findById(req.userId).select(
      "name email onboarding createdAt updatedAt"
    );

    return res.status(200).json({
      message: "User profile updated.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update user profile.",
      error: error.message,
    });
  }
});

router.put("/onboarding", requireAuth, async (req, res) => {
  try {
    const onboardingPayload = req.body.onboarding;

    if (!onboardingPayload || typeof onboardingPayload !== "object") {
      return res.status(400).json({
        message: "Onboarding data is required.",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const normalizedOnboarding = normalizeOnboardingPayload(onboardingPayload);

    user.onboarding = {
      ...(user.onboarding?.toObject?.() || user.onboarding || {}),
      ...normalizedOnboarding,
      completedAt: new Date(),
    };

    await user.save();

    return res.status(200).json({
      message: "Onboarding saved.",
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({
      message: "Failed to save onboarding.",
      error: error.message,
    });
  }
});

module.exports = router;