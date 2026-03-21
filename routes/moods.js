import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * GET ALL MOODS
 * Path: /api/moods
 */
router.get("/", async (req, res) => {
  try {
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
    // Naka-parameterized query ito (Secure), pero sa POST tayo mag-tetest ng injection
    const [result] = await db.query("DELETE FROM mood_entries WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reflection not found." });
    }
    res.json({ message: "Reflection removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete." });
  }
});

/**
 * ADD NEW MOOD (VULNERABLE VERSION - FOR STEP 1 TESTING)
 * Path: /api/moods
 */
router.post("/", async (req, res) => {
  const { name, reflection } = req.body;

  if (!name || !reflection) {
    return res.status(400).json({ error: "Name and reflection are required" });
  }

  try {
    // ❌ VULNERABLE: Ginamit ang string concatenation (+) sa halip na placeholders (?)
    // Ito ang magpapahintulot sa SQL Injection attack
    const query = "INSERT INTO mood_entries (user_id, mood_text) VALUES ('" + name + "', '" + reflection + "')";
    
    console.log("Executing Query:", query); // Makikita mo sa terminal kung paano nabago ang query ng input mo
    
    const [result] = await db.query(query);
    
    res.status(201).json({ 
      message: "Mood added successfully!",
      id: result.insertId 
    });
  } catch (err) {
    console.error("Database Error:", err.message);
    // Pinapakita natin ang exact error message para sa documentation ng Step 1
    res.status(500).json({ error: "SQL Error: " + err.message });
  }
});

export default router;