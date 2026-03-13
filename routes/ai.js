// routes/ai.js

router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // We use the full versioned name which is more stable across v1/v1beta
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" }); 

    const prompt = `The user is feeling: "${text}". Give a very short, 1-sentence empathetic response or piece of advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (error) {
    console.error("AI Backend Error:", error);
    res.status(500).json({ suggestion: "Take a deep breath. You are doing great." });
  }
});