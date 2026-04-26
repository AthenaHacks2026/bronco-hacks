const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function explainRecommendations(user, recommendations) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are helping match caregivers with donated baby items.

User profile:
${JSON.stringify(user.onboarding, null, 2)}

Recommended items:
${JSON.stringify(recommendations, null, 2)}

Give a short explanation for why these recommendations make sense.
Return JSON in this format:
{
  "summary": "short paragraph",
  "items": [
    { "id": "item1", "reason": "..." }
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}

module.exports = { explainRecommendations };