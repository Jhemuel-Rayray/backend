import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 1. Existing Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes);

// 2. ERROR ROUTE (Ito yung i-dedebug niyo ni Sir)
// Sinadya nating mali ito para lumabas yung Error sa Terminal
app.post("/mood", async (req, res) => {
  console.log("POST /mood request received");
  console.log("Request body:", req.body);

  try {
    const mood = req.body.mood;
    
    // MALI ITO: 'mood_log' table ay malamang hindi nage-exist 
    // at 'mood' column lang ang nilalagyan imbis na 'mood_text'
    const [result] = await db.query(
      "INSERT INTO mood_log (mood) VALUES (?)",
      [mood]
    );

    console.log("Database insert result:", result);
    res.json({ message: "Mood saved successfully" });
  } catch (err) {
    // DITO LALABAS YUNG ERROR SA TERMINAL MO
    console.error("❌ BACKEND ERROR FOR DEBUGGING:", err.message);
    res.status(500).json({ 
      error: "Backend Error: Table or Column not found",
      details: err.message 
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live at port ${PORT}`);
});