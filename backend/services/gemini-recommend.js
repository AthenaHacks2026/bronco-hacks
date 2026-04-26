const { GoogleGenAI } = require("@google/genai");
const { NORMALIZED_CATEGORIES } = require("./recommender");

const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function safeParseJson(rawText) {
  if (!rawText) return null;
  const cleaned = String(rawText)
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    return null;
  }
}

function buildPrompt(user, basePayload) {
  return `
You are assisting a baby-item recommendation system for caregivers.
Return STRICT JSON only. Do not include markdown.

Allowed normalized categories:
${JSON.stringify(NORMALIZED_CATEGORIES)}

User onboarding:
${JSON.stringify(user?.onboarding || {}, null, 2)}

Current backend payload:
${JSON.stringify(basePayload, null, 2)}

Task:
1) Improve normalizedNeeds (map rawTag -> category + reason) while keeping category only in allowed list.
2) Suggest 2-4 recommended categories not already in lookingFor.categories, each with:
   - category (must be allowed list)
   - displayLabel (short user-friendly)
   - reason
3) Update summary (1 sentence).
4) Update insights (2-3 short strings).
5) Add/refresh item reasons in lookingFor.items and recommended.items.
   - Keep item ids exactly as provided.
   - Never invent new items.

Output schema:
{
  "summary": "string",
  "normalizedNeeds": [{ "rawTag": "string", "category": "string", "reason": "string" }],
  "recommendedCategories": [{ "category": "string", "displayLabel": "string", "reason": "string" }],
  "lookingForItemReasons": [{ "id": "string", "reason": "string" }],
  "recommendedItemReasons": [{ "id": "string", "reason": "string" }],
  "insights": ["string"]
}
`;
}

function mergeGeminiResult(basePayload, geminiJson) {
  const nextPayload = { ...basePayload };
  const safeCategories = new Set(NORMALIZED_CATEGORIES);

  if (typeof geminiJson?.summary === "string" && geminiJson.summary.trim()) {
    nextPayload.summary = geminiJson.summary.trim();
  }

  if (Array.isArray(geminiJson?.normalizedNeeds)) {
    nextPayload.normalizedNeeds = geminiJson.normalizedNeeds
      .filter((entry) => entry && safeCategories.has(entry.category))
      .map((entry) => ({
        rawTag: entry.rawTag,
        category: entry.category,
        reason: entry.reason || "",
      }));
  }

  if (Array.isArray(geminiJson?.recommendedCategories)) {
    nextPayload.recommended = {
      ...nextPayload.recommended,
      categories: geminiJson.recommendedCategories
        .filter((entry) => entry && safeCategories.has(entry.category))
        .map((entry) => ({
          category: entry.category,
          displayLabel: entry.displayLabel || entry.category,
          reason: entry.reason || "",
        })),
    };
  }

  const lookingForReasonMap = new Map(
    (geminiJson?.lookingForItemReasons || []).map((entry) => [entry.id, entry.reason])
  );
  const recommendedReasonMap = new Map(
    (geminiJson?.recommendedItemReasons || []).map((entry) => [entry.id, entry.reason])
  );

  if (nextPayload?.lookingFor?.items) {
    nextPayload.lookingFor.items = nextPayload.lookingFor.items.map((item) => ({
      ...item,
      reasons: lookingForReasonMap.has(item.id)
        ? [lookingForReasonMap.get(item.id)]
        : item.reasons,
    }));
  }

  if (nextPayload?.recommended?.items) {
    nextPayload.recommended.items = nextPayload.recommended.items.map((item) => ({
      ...item,
      reasons: recommendedReasonMap.has(item.id)
        ? [recommendedReasonMap.get(item.id)]
        : item.reasons,
    }));
  }

  if (Array.isArray(geminiJson?.insights) && geminiJson.insights.length) {
    nextPayload.insights = geminiJson.insights
      .filter((value) => typeof value === "string" && value.trim())
      .slice(0, 3);
  }

  return nextPayload;
}

async function enhanceRecommendationsWithGemini(user, basePayload) {
  if (!process.env.GEMINI_API_KEY) {
    return basePayload;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = buildPrompt(user, basePayload);
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ text: prompt }],
      config: { temperature: 0.2, responseMimeType: "application/json" },
    });
    const parsed = safeParseJson(response.text);
    if (!parsed) return basePayload;
    return mergeGeminiResult(basePayload, parsed);
  } catch (error) {
    console.warn("Gemini recommendation enrichment failed:", error.message);
    return basePayload;
  }
}

module.exports = {
  enhanceRecommendationsWithGemini,
};