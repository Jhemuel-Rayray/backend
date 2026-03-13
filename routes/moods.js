import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * GET ALL MOODS
 * Path: /api/moods (if prefixed in server.js)
 */
router.get("/", async (req, res) => {
  try {
    // We select user_id AS full_name to match your Vue template 'm.full_name'
    const [results] = await db.query(
      "SELECT id, user_id AS full_name, mood_text, created_at FROM mood_entries ORDER BY created_at DESC"
    );
    
    // Always return an array, even if empty
    res.json(results || []);
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ error: "Failed to fetch reflections from database." });
  }
});

/**
 * DELETE A MOOD
 * Path: /api/moods/:id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM mood_entries WHERE id = ?", [id]);
    res.json({ message: "Reflection removed successfully" });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).json({ error: "Could not delete the reflection." });
  }
});

/**
 * ADD NEW MOOD
 * Path: /api/moods
 */
router.post("/", async (req, res) => {
  // These keys now match the object sent from MoodForm.vue
  const { name, reflection } = req.body;

  // Validation
  if (!name || !reflection) {
    return res.status(400).json({ error: "Name and reflection are required" });
  }

  try {
    // IMPORTANT: Ensure 'user_id' in MySQL is VARCHAR/TEXT to store the name string
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
      [name, reflection]
    );
    
    res.status(201).json({ 
      message: "Mood added successfully!",
      id: result.insertId 
    });
  } catch (err) {
    console.error("Database Error:", err.message);
    
    // Custom error message for the common "Data truncated" or "Incorrect integer value" error
    if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      return res.status(500).json({ 
        error: "Database setup error: user_id column must be a string/VARCHAR, not an integer." 
      });
    }

    res.status(500).json({ error: "Could not save your reflection to the database." });
  }
});

export default router;