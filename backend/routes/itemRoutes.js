const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const Item = require("../models/Item");
const { GoogleGenAI } = require("@google/genai");

const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// VERY SIMPLE VERSION (you can upgrade later)
router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    const { text, condition, brand, year } = req.body;

    if (!brand || !year) {
      return res.status(400).json({ error: "Brand and year are required." });
    }

    // AI CALL (simplified for now)
    const response = await ai.models.generateContent({
      model: "gemma-4-31b-it",
      contents: `Analyze this baby product: ${text}`,
    });

    const aiText = response.text;

    // Fake parsed structure (replace later with your full logic)
    const parsed = {
      itemName: text,
      detectedBrand: brand,
      category: "feeding",
      isRelevant: true,
      needsReview: false,
      confidence: 0.9,
    };

    // Recall check
    const recallRes = await axios.get(
      `https://www.saferproducts.gov/RestWebServices/Recall?ProductName=${brand}&format=json`
    );

    const recall = {
      recallStatus: recallRes.data.length > 0 ? "possible_match" : "clear",
    };

    let finalStatus = "approved";

    if (recall.recallStatus === "possible_match") {
      finalStatus = "blocked";
    }

    // SAVE TO MONGODB
    const newItem = await Item.create({
      text,
      condition,
      declaredBrand: brand,
      declaredYear: year,
      itemName: parsed.itemName,
      detectedBrand: parsed.detectedBrand,
      category: parsed.category,
      isRelevant: parsed.isRelevant,
      needsReview: parsed.needsReview,
      confidence: parsed.confidence,
      recall,
      finalStatus,
    });

    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze item" });
  }
});

router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

module.exports = router;