import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// FORCE THE VERSION TO "v1" instead of the default beta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // Explicitly request the model without 'latest' and ensure v1 is used
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      apiVersion: 'v1' // Add this line!
    });

    const prompt = `The user is feeling: "${text}". Give a very short, 1-sentence empathetic response or piece of advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    console.error("AI Backend Error:", error);
    // Return a fallback so the UI doesn't break
    res.status(500).json({ suggestion: "Take a deep breath. You are doing great." });
  }
});

export default router;