const express = require("express");
const multer = require("multer");
const axios = require("axios");
const Item = require("../models/Item");
const requireAuth = require("../middleware/auth");
const GoogleGenAI = require("@google/genai").GoogleGenAI;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function getAIClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

router.post(
  "/analyze-image",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { text, condition, brand, year } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image is required." });
      }

      if (!brand || !year) {
        return res.status(400).json({ error: "Brand and year are required." });
      }

      const prompt = `
You are reviewing a donated maternity or baby item for a community platform.

Return ONLY valid JSON with this exact shape:
{
  "item_name": "string",
  "detected_brand": "string",
  "category": "string",
  "is_relevant": true,
  "needs_review": false,
  "review_reason": "string",
  "confidence": 0.0,
  "final_status": "approved",
  "final_reason": "string"
}

Rules:
- Be conservative with baby items.
- Car seats, cribs, breast pumps, bottles, pacifiers, and feeding items often need review.
- If uncertain, set needs_review to true and final_status to "needs_review".
- Categories can be: feeding, clothing, nursery, transport, hygiene, toys, maternity, postpartum, safety, other.
- Output JSON only. No markdown.

Input:
Description: ${text || ""}
Brand: ${brand || ""}
Year: ${year || ""}
Condition: ${condition || ""}
`;

      let parsed;

      try {
        const ai = getAIClient();

        const response = await ai.models.generateContent({
          model: "gemma-4-31b-it",
          contents: prompt,
        });

        console.log("AI RESPONSE:", response);
        console.log("AI TEXT:", response.text);

        const aiText = response.text || "";

        try {
          parsed = JSON.parse(aiText);
        } catch {
          parsed = {
            item_name: text || "Unknown item",
            detected_brand: brand || "Unknown",
            category: "other",
            is_relevant: true,
            needs_review: true,
            review_reason: "AI response could not be parsed. Manual review required.",
            confidence: 0.4,
            final_status: "needs_review",
            final_reason: "AI response was not valid JSON.",
          };
        }
      } catch (aiError) {
        console.error("AI ERROR:", aiError.message);

        parsed = {
          item_name: text || "Unknown item",
          detected_brand: brand || "Unknown",
          category: "other",
          is_relevant: true,
          needs_review: true,
          review_reason: "AI service failed. Manual review required.",
          confidence: 0.2,
          final_status: "needs_review",
          final_reason: `AI error: ${aiError.message}`,
        };
      }

      let recall = {
        recall_status: "unknown",
        recall_count: 0,
        recall_query: brand,
        recall_title: "",
        recall_description: "",
      };

      try {
        const recallRes = await axios.get(
          `https://www.saferproducts.gov/RestWebServices/Recall?ProductName=${encodeURIComponent(
            brand
          )}&format=json`
        );

        if (Array.isArray(recallRes.data) && recallRes.data.length > 0) {
          recall = {
            recall_status: "possible_match",
            recall_count: recallRes.data.length,
            recall_query: brand,
            recall_title: recallRes.data[0]?.Title || "",
            recall_description: recallRes.data[0]?.Description || "",
          };
        } else {
          recall = {
            recall_status: "clear",
            recall_count: 0,
            recall_query: brand,
            recall_title: "",
            recall_description: "",
          };
        }
      } catch (recallError) {
        console.error("Recall check failed:", recallError.message);
      }

      let finalStatus = parsed.final_status || "needs_review";
      let finalReason =
        parsed.final_reason ||
        parsed.review_reason ||
        "Manual review recommended.";

      if (recall.recall_status === "possible_match") {
        finalStatus = "blocked";
        finalReason = "Possible recall match found. Manual review required.";
      }

      const newItem = await Item.create({
        userId: req.userId,
        text,
        condition,
        declaredBrand: brand,
        declaredYear: year,
        itemName: parsed.item_name,
        detectedBrand: parsed.detected_brand,
        category: parsed.category,
        isRelevant: parsed.is_relevant,
        needsReview: parsed.needs_review,
        reviewReason: parsed.review_reason,
        confidence: parsed.confidence,
        recall: {
          recallStatus: recall.recall_status,
          recallCount: recall.recall_count,
          recallQuery: recall.recall_query,
          recallTitle: recall.recall_title,
          recallDescription: recall.recall_description,
        },
        finalStatus,
        finalReason,
      });

      return res.json({
        id: newItem._id,
        final_status: finalStatus,
        final_reason: finalReason,
        item_name: parsed.item_name,
        detected_brand: parsed.detected_brand,
        category: parsed.category,
        recall: {
          recall_status: recall.recall_status,
          recall_count: recall.recall_count,
          recall_title: recall.recall_title,
        },
      });
    } catch (error) {
      console.error("Analyze item error:", error);
      return res.status(500).json({
        error: error.message || "Failed to analyze item",
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch items." });
  }
});

module.exports = router;