import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // DEBUG FIX: Imbes na 'gemini-3-flash', gagamitin natin ang 'gemini-1.5-flash'
    // Pero siguraduhin nating walang 'models/' prefix kung hindi kailangan ng library version mo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `User reflection: "${text}". Give a very short, 1-sentence supportive response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    // Dito po natin makikita kung papasa na siya o hinde
    console.error("❌ AI DEBUG LOG:", error.message);
    res.status(500).json({ suggestion: "Take a deep breath. You are doing great." });
  }
});

export default router;