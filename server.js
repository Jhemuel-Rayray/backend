import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js";

// 1. Load environment variables FIRST
dotenv.config();

const app = express();

// 2. Middlewares
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 3. Existing Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes);

// --- ERROR ROUTE PARA SA DEBUGGING NI SIR ---
// Pinagawa ni Sir: Dapat mag-log at mag-insert sa 'mood_log'
app.post("/mood", async (req, res) => {
  console.log("POST /mood request received");
  console.log("Request body:", req.body);

  try {
    const mood = req.body.mood;
    
    // Ito ang mag-ko-cause ng error (Table 'mood_log' doesn't exist)
    const [result] = await db.query(
      "INSERT INTO mood_log (mood) VALUES (?)",
      [mood]
    );

    console.log("Database insert result:", result);
    res.json({ message: "Mood saved successfully" });
  } catch (err) {
    // DITO LALABAS YUNG SCREENSHOT MO SA TERMINAL
    console.log("-----------------------------------------");
    console.error("❌ BACKEND ERROR FOR DEBUGGING:", err.message);
    console.log("-----------------------------------------");
    res.status(500).json({ 
      error: "Database Error", 
      details: err.message 
    });
  }
});
// --- END NG ERROR ROUTE ---

// 4. Health Check / Test Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running and connected to Render!");
});

app.get("/test-db", async (req, res) => {
  try {
    if (!db) {
      throw new Error("Database connection pool is not initialized.");
    }
    const [rows] = await db.query("SELECT 1 as connected");
    res.json({ 
      status: "Success", 
      message: "Connected to Railway MySQL!", 
      data: rows 
    });
  } catch (err) {
    console.error("❌ DB Test Error:", err.message);
    res.status(500).json({ status: "Error", error: err.message });
  }
});

// 5. Server Listener
const PORT = process.env.PORT || 1000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live at port ${PORT}`);
});