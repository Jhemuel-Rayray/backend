import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get all moods
router.get("/", async (req, res) => {
  try {
    // We use AS to make sure the database columns match your Vue m.full_name and m.mood_text
    const [results] = await db.query(
      "SELECT user_id AS full_name, mood_text FROM mood_entries ORDER BY created_at DESC"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new mood
router.post("/", async (req, res) => {
  // Capture the names you are sending from MoodForm.vue
  const { name, reflection } = req.body;

  if (!name || !reflection) {
    return res.status(400).json({ error: "Name and reflection are required" });
  }

  try {
    // Make sure your table 'mood_entries' has these column names!
    await db.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
      [name, reflection]
    );
    res.status(201).json({ message: "Mood added successfully!" });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "Database error. Check column types!" });
  }
});

export default router;