import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize the API with your key from Render Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ suggestion: "I'm listening. How are you feeling?" });
  }

  try {
    // We use 'gemini-1.5-flash' which is the fastest model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `The user is reflecting on their mood: "${text}". 
    Provide a very short, one-sentence empathetic response or supportive advice. 
    Keep it under 20 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    console.error("AI Backend Error:", error);
    // Fallback response so the UI doesn't break if the API fails
    res.status(500).json({ 
      suggestion: "Remember to breathe, stay grounded, and take things one step at a time." 
    });
  }
});

// THIS WAS THE CAUSE OF YOUR RECENT CRASH
export default router;