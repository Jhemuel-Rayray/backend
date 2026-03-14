import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getAIResponse(userMood) {
  try {
    // 💡 DAPAT gemini-1.5-flash ANG NAKALAGAY DITO
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `The user says: "${userMood}". Give a very short, supportive advice (1-2 sentences).`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Keep your head up! I'm here to listen.";
  }
}