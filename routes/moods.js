import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get all moods
router.get("/", async (req, res) => {
  try {
    // TAMA: Ginagamit ang 'mood_entries' table
    const [results] = await db.query("SELECT * FROM mood_entries ORDER BY created_at DESC");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new mood
router.post("/", async (req, res) => {
  // Kinukuha ang data mula sa Frontend (MoodForm.vue)
  // Siguraduhin na 'username' at 'reflection' ang ipinapadala ng iyong frontend
  const { username, reflection } = req.body; 

  if (!username || !reflection) {
    return res.status(400).json({ error: "Name and reflection are required" });
  }

  try {
    // TAMA: Gagamitin ang 'user_id' at 'mood_text' columns base sa iyong Railway table
    await db.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)", 
      [username, reflection]
    );
    
    res.status(201).json({ message: "Mood added successfully!" });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;