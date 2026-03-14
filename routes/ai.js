import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // DEBUG UPDATE: 
    // Minsan Sir, yung library version natin is nag-eexpect ng 'models/gemini-1.5-flash' 
    // imbis na 'gemini-1.5-flash' lang. Sinisiguro nito na hindi siya mag-404 sa v1beta.
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `User said: "${text}". Give a very short, one-sentence empathetic reply.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    // Dito natin mahuhuli kung bakit ayaw pa rin
    console.error("❌ FINAL AI DEBUG LOG:", error.message);
    
    // Safety fallback para hindi mag-crash ang UI ni Sir
    res.json({ suggestion: "Take a deep breath. Everything will be okay." });
  }
});

export default router;