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
// Explicitly allowing DELETE and OPTIONS for GitHub Pages compatibility
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 3. Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes); // Inayos ang posisyon nito

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
const PORT = process.env.PORT || 1000; // Render usually uses 1000 or 10000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live at port ${PORT}`);
});