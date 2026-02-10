import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStatisticalInsight = async (
  context: string,
  statsSummary: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "Enter a valid API Key to get AI-powered statistical insights.";

  try {
    const prompt = `
      You are a Senior Data Scientist. Explain the following statistical result to a junior analyst.
      Context: ${context}
      Data/Stats: ${statsSummary}
      
      Requirements:
      1. Explain what the metric means briefly.
      2. Interpret the specific values provided.
      3. Give a "Takeaway" or "Actionable Insight".
      4. Keep it concise (under 100 words).
      5. Do not use Markdown formatting like bold or headers, just plain text or simple bullet points.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time.";
  }
};