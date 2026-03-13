import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // FIX: Using the absolute model path prevents the 404 versioning error
    // If 'gemini-1.5-flash' fails, we immediately catch and try 'gemini-pro'
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `The user is feeling: "${text}". Give a very short, 1-sentence empathetic response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    console.error("AI Primary Model Error:", error.message);
    
    // SECONDARY FALLBACK: Try the classic Gemini Pro if Flash is unavailable in your region
    try {
      const backupModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await backupModel.generateContent(`Support this person: ${text}`);
      const response = await result.response;
      res.json({ suggestion: response.text() });
    } catch (fallbackError) {
      console.error("AI Fallback Error:", fallbackError.message);
      res.status(500).json({ suggestion: "Take a deep breath. You are doing your best." });
    }
  }
});

export default router;