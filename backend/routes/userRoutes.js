const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.put("/onboarding", requireAuth, async (req, res) => {
  try {
    const onboardingPayload = req.body.onboarding;

    if (!onboardingPayload || typeof onboardingPayload !== "object") {
      return res.status(400).json({ message: "onboarding payload is required." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.onboarding = {
      ...user.onboarding?.toObject?.(),
      ...onboardingPayload,
      completedAt: new Date(),
    };

    await user.save();

    return res.status(200).json({
      message: "Onboarding saved.",
      onboarding: user.onboarding,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to save onboarding.", error: error.message });
  }
});

module.exports = router;
const User = require("../models/User");

// Save onboarding data
router.put("/onboarding", async (req, res) => {
  try {
    const { userId, onboarding } = req.body;

    if (!userId || !onboarding) {
      return res.status(400).json({
        message: "userId and onboarding data are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.onboarding = onboarding;
    user.onboarding.completedAt = new Date();

    await user.save();

    return res.json({
      message: "Onboarding saved successfully",
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({
      message: "Failed to save onboarding",
      error: error.message,
    });
  }
});
