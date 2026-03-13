import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * GET ALL MOODS
 * Path: /api/moods
 */
router.get("/", async (req, res) => {
  try {
    // Aliasing user_id as full_name to match your Vue template requirements
    const [results] = await db.query(
      "SELECT id, user_id AS full_name, mood_text, created_at FROM mood_entries ORDER BY created_at DESC"
    );
    
    res.json(results || []);
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ error: "Failed to fetch reflections." });
  }
});

/**
 * DELETE A MOOD
 * Path: /api/moods/:id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM mood_entries WHERE id = ?", [id]);
    
    // Check if something was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reflection not found." });
    }

    res.json({ message: "Reflection removed successfully" });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).json({ error: "Could not delete the reflection from the database." });
  }
});

/**
 * ADD NEW MOOD
 * Path: /api/moods
 */
router.post("/", async (req, res) => {
  const { name, reflection } = req.body;

  if (!name || !reflection) {
    return res.status(400).json({ error: "Name and reflection are required" });
  }

  try {
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
    
    if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      return res.status(500).json({ 
        error: "Database schema error: user_id must be VARCHAR, not INT." 
      });
    }

    res.status(500).json({ error: "Could not save your reflection." });
  }
});

export default router;