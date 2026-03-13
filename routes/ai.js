import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `The user is feeling: "${text}". Give a very short, 1-sentence empathetic response or piece of advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    console.error("AI Backend Error:", error);
    res.status(500).json({ suggestion: "Take a deep breath. You are doing your best." });
  }
});

export default router;