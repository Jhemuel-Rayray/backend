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
  // accept both sets of keys the frontend might send
  const username = req.body.username || req.body.name;
  const reflection = req.body.reflection || req.body.mood;

  if (!username || !reflection) {
    return res.status(400).json({ error: "Name and reflection are required" });
  }

  try {
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