import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get all moods
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM mood_entries ORDER BY created_at DESC");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new mood
router.post("/", async (req, res) => {
  // Kinukuha ang data mula sa Frontend (MoodForm.vue)
  const { full_name, mood_text } = req.body; 

  if (!full_name || !mood_text) {
    return res.status(400).json({ error: "Name and mood are required" });
  }

  try {
    // INSERT sa 'user_name' column dahil ito ang nasa Railway table mo
    await db.query(
      "INSERT INTO mood_entries (user_name, mood_text) VALUES (?, ?)", 
      [full_name, mood_text]
    );
    
    res.status(201).json({ message: "Mood added successfully!" });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;