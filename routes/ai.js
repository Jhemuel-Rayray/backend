import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // GAMITIN ANG STABLE VERSION: gemini-1.5-flash
    // Ito ang model na 100% working sa v1beta API para sa general use.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `User reflection: "${text}". Give a very short, 1-sentence supportive response (max 15 words).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ suggestion: response.text() });
  } catch (error) {
    console.error("AI Error (Main):", error.message);
    
    // FALLBACK: Kung may issue sa 1.5, ito ang ultimate backup para hindi mag-error ang screen ng user
    try {
      // Pwedeng subukan ang gemini-1.0-pro kung ayaw talaga ng flash
      const backup = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
      const result = await backup.generateContent(`Be supportive: ${text}`);
      const response = await result.response;
      res.json({ suggestion: response.text() });
    } catch (err) {
      // Kapag wala talagang internet o block ang API key, ito ang lalabas:
      res.json({ suggestion: "Take a deep breath. You are doing great today." });
    }
  }
});

export default router;