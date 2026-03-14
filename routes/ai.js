import express from "express";
const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { text } = req.body;
  
  // 1. Array ng mga random supportive responses
  const responses = [
    "That sounds like a meaningful reflection. Keep focusing on your growth!",
    "It's great that you're tracking your mood. Stay positive and keep going!",
    "Every step counts. Thank you for sharing how you feel today.",
    "Acknowledging your feelings is the first step to a better day. You got this!",
    "Your reflection shows a lot of self-awareness. Keep up the good work!"
  ];

  // 2. Pumili ng random response para mukhang "nag-iisip" ang AI
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  console.log("🛠️ Mock AI Response sent to avoid 404 error.");

  // 3. I-return ang response (ito ang babasahin ng frontend mo)
  res.json({ suggestion: randomResponse });
});

export default router;