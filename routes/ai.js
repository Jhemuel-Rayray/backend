import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// The key remains the same, but the models have moved to the Gemini 3 family
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // 1. AS OF MARCH 2026: 'gemini-3.1-flash-lite' is the new standard for fast insights.
    // If that's too new, 'gemini-3-flash' is the stable workhorse.
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

    const prompt = `User reflection: "${text}". Give a very short, 1-sentence supportive response (max 15 words).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ suggestion: response.text() });
  } catch (error) {
    console.error("AI Error:", error.message);
    
    // 2. FALLBACK: If Gemini 3 is overloaded, use Gemini 2.5 which is still active.
    try {
      const backup = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await backup.generateContent(`Be supportive: ${text}`);
      const response = await result.response;
      res.json({ suggestion: response.text() });
    } catch (err) {
      res.json({ suggestion: "Take a deep breath. You are doing great today." });
    }
  }
});

export default router;