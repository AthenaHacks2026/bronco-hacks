const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mockItems = require("../data/mockItems");
const { getRecommendations } = require("../services/recommender");

// auth middleware sets req.userId
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recommendations = getRecommendations(user, mockItems);

    res.json({ recommendations });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

module.exports = router;