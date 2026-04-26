const express = require("express");
const multer = require("multer");
const axios = require("axios");
const Item = require("../models/Item");
const { GoogleGenAI } = require("@google/genai");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function safeParseModelJson(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    const firstBrace = rawText.indexOf("{");
    if (firstBrace === -1) {
      throw new Error(`Model did not return JSON. Raw response: ${rawText}`);
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = firstBrace; i < rawText.length; i++) {
      const char = rawText[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") depth++;
        if (char === "}") depth--;

        if (depth === 0) {
          return JSON.parse(rawText.slice(firstBrace, i + 1));
        }
      }
    }

    throw new Error(`Could not extract valid JSON. Raw response: ${rawText}`);
  }
}

const responseSchema = {
  type: "object",
  properties: {
    item_name: { type: "string" },
    detected_brand: { type: "string" },
    detected_model: { type: "string" },
    category: {
      type: "string",
      enum: [
        "maternity",
        "feeding",
        "clothing",
        "sleep",
        "hygiene",
        "transport",
        "toys",
        "furniture",
        "other",
      ],
    },
    is_relevant: { type: "boolean" },
    stage_fit: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "early_pregnancy",
          "late_pregnancy",
          "immediate_postpartum",
          "newborn_0_3_months",
          "infant_3_12_months",
        ],
      },
    },
    condition: {
      type: "string",
      enum: ["new", "like_new", "used_good", "used_fair", "poor"],
    },
    condition_tags: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "washed",
          "clean",
          "minor_stain",
          "missing_part",
          "loose_part",
          "damaged",
          "functional",
          "unverified",
          "expired",
          "safety_concern",
        ],
      },
    },
    needs_review: { type: "boolean" },
    review_reason: { type: "string" },
    confidence: { type: "number" },
  },
  required: [
    "item_name",
    "detected_brand",
    "detected_model",
    "category",
    "is_relevant",
    "stage_fit",
    "condition",
    "condition_tags",
    "needs_review",
    "review_reason",
    "confidence",
  ],
};

function buildPrompt(text, condition, brand, year) {
  return `
You are an assistant for a maternal and infant donation platform.
Return only one raw JSON object matching the schema exactly.

Use the uploaded image and donor-provided information to classify the item.

Declared brand: "${brand}"
Declared year: "${year}"
Donor text: "${text}"
Donor condition: "${condition}"

Rules:
- If item is not related to pregnancy, postpartum, or infant care (0-12 months), set is_relevant=false and category="other".
- detected_brand is required. If unknown, return "".
- detected_model is required. If unknown, return "".
- If image and description conflict, set needs_review=true and explain why.
- Be conservative about safety.
`;
}

function buildFallbackAnalysis(text, condition, brand) {
  const normalizedText = String(text || "").toLowerCase();
  const normalizedCondition = String(condition || "").toLowerCase();
  const normalizedBrand = String(brand || "").trim();

  const categoryKeywords = [
    ["feeding", ["bottle", "formula", "nursing", "feeding", "sippy"]],
    ["clothing", ["clothing", "clothes", "onesie", "shirt", "pants"]],
    ["sleep", ["crib", "bassinet", "sleep", "blanket"]],
    ["hygiene", ["diaper", "wipes", "soap", "hygiene"]],
    ["transport", ["stroller", "car seat", "carrier"]],
    ["toys", ["toy", "rattle", "book"]],
    ["furniture", ["chair", "table", "dresser"]],
    ["maternity", ["maternity", "pregnancy", "postpartum"]],
  ];

  let category = "other";
  for (const [candidate, keywords] of categoryKeywords) {
    if (keywords.some((word) => normalizedText.includes(word))) {
      category = candidate;
      break;
    }
  }

  const isRelevant = category !== "other";
  const aiCondition = normalizedCondition.includes("new") ? "new" : "used_good";

  return {
    item_name: text || "Donated item",
    detected_brand: normalizedBrand,
    detected_model: "",
    category,
    is_relevant: isRelevant,
    stage_fit: ["newborn_0_3_months", "infant_3_12_months"],
    condition: aiCondition,
    condition_tags: aiCondition === "new" ? ["clean"] : ["functional"],
    needs_review: false,
    review_reason: "",
    confidence: 0.6,
  };
}

async function checkRecall(productName, brand = "") {
  try {
    const searchTerm = [brand, productName].filter(Boolean).join(" ").trim();
    const url = `https://www.saferproducts.gov/RestWebServices/Recall?ProductName=${encodeURIComponent(searchTerm)}&format=json`;
    const response = await axios.get(url, { timeout: 10000 });
    const recalls = Array.isArray(response.data) ? response.data : [];

    if (recalls.length > 0) {
      const first = recalls[0];
      return {
        recall_status: "possible_match",
        recall_count: recalls.length,
        recall_query: searchTerm,
        recall_title: first?.Name || "",
        recall_description: first?.RecallDescription || "",
      };
    }

    return {
      recall_status: "clear",
      recall_count: 0,
      recall_query: searchTerm,
      recall_title: "",
      recall_description: "",
    };
  } catch (error) {
    return {
      recall_status: "unknown",
      recall_count: 0,
      recall_query: [brand, productName].filter(Boolean).join(" ").trim(),
      recall_title: "",
      recall_description: "",
      recall_error: error.message,
    };
  }
}

function applySafetyRules(parsed, recallResult) {
  const blockedTags = ["expired"];
  const reviewTags = [
    "missing_part",
    "loose_part",
    "damaged",
    "unverified",
    "safety_concern",
  ];

  if (recallResult?.recall_status === "possible_match") {
    return {
      final_status: "blocked",
      final_reason: "Possible recall match found. Item should not be listed until reviewed.",
    };
  }

  if (!parsed.is_relevant) {
    return {
      final_status: "needs_review",
      final_reason: "Item not relevant to maternity or infant care.",
    };
  }

  if (parsed.condition_tags.some((tag) => blockedTags.includes(tag))) {
    return {
      final_status: "blocked",
      final_reason: "Item is expired and unsafe.",
    };
  }

  if (
    parsed.needs_review ||
    parsed.confidence < 0.7 ||
    parsed.condition_tags.some((tag) => reviewTags.includes(tag))
  ) {
    return {
      final_status: "needs_review",
      final_reason: parsed.review_reason || "Manual review required.",
    };
  }

  return {
    final_status: "approved",
    final_reason: "Passed safety checks.",
  };
}

router.post("/analyze-image", requireAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const text = req.body.text || "";
    const condition = req.body.condition || "";
    const brand = String(req.body.brand || "").trim();
    const year = String(req.body.year || "").trim();

    if (!brand || !year) {
      return res.status(400).json({ error: "Brand and year are required." });
    }

    const prompt = `
${buildPrompt(text, condition, brand, year)}

Important:
- Return only one JSON object.
- Do not include markdown.
- Do not include explanation text before or after the JSON.
`;

    let parsed;

    if (!process.env.GEMINI_API_KEY) {
      parsed = buildFallbackAnalysis(text, condition, brand);
    } else {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            { text: prompt },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: req.file.buffer.toString("base64"),
              },
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.1,
          },
        });

        parsed = safeParseModelJson(response.text);
      } catch (modelError) {
        console.warn(
          "Gemini analyze failed, using fallback analyzer:",
          modelError.message
        );
        parsed = buildFallbackAnalysis(text, condition, brand);
      }
    }
    const recall = await checkRecall(parsed.item_name, brand);
    const decision = applySafetyRules(parsed, recall);

    const savedItem = await Item.create({
      donorUserId: req.userId,
      userId: req.userId,
      title: parsed.item_name || text || "Donated item",
      description: text,
      rawTags: [],
      status: decision.final_status === "approved" ? "available" : "removed",
      text,
      condition,
      declaredBrand: brand,
      declaredYear: year,
      itemName: parsed.item_name,
      detectedBrand: parsed.detected_brand,
      detectedModel: parsed.detected_model,
      category: parsed.category,
      isRelevant: parsed.is_relevant,
      stageFit: parsed.stage_fit,
      aiCondition: parsed.condition,
      conditionTags: parsed.condition_tags,
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
      finalStatus: decision.final_status,
      finalReason: decision.final_reason,
    });

    return res.status(200).json({
      declared_brand: brand,
      declared_year: year,
      ...parsed,
      recall,
      ...decision,
      savedItem,
    });
  } catch (error) {
    console.error("Analyze image error:", error);
    return res.status(500).json({
      error: "Failed to analyze image.",
      details: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch items.",
      details: error.message,
    });
  }
});

module.exports = router;