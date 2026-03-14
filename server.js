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

// 3. Routes (Standard)
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes);

// --- 🔴 START NG DEBUGGING SECTION (PART 1 - BUG #3) ---
// Ginawa itong route na ito para sadyang mag-error nang hindi namamatay ang server.
app.post("/mood", async (req, res) => {
  console.log("POST /mood request received para sa debugging...");

  try {
    const mood = req.body.mood;

    // 🔴 BUG #3: "mood_logs" (may 's') ang nilagay ko para mag-error. 
    // Ang tamang table name ay "mood_log".
    const [result] = await db.query(
      "INSERT INTO mood_logs (mood) VALUES (?)", 
      [mood]
    );

    res.json({ message: "Saved successfully!" });
  } catch (err) {
    // 📸 SCREENSHOT MO ITO: Ito yung lalabas sa Terminal/Render Logs
    console.log("*****************************************");
    console.error("❌ SQL ERROR FOUND:", err.message); 
    console.log("*****************************************");

    // I-send ang error sa frontend imbis na i-crash ang buong backend
    res.status(500).json({ 
      error: "Database Error: Table 'mood_logs' doesn't exist.",
      details: err.message 
    });
  }
});
// --- 🔴 END NG DEBUGGING SECTION ---

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