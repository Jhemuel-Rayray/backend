import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js";

app.use("/api/ai", aiRoutes);

dotenv.config();

const app = express();

// 1. Middlewares - Mahalaga ang pagkakasunod-sunod
app.use(cors()); // Payagan ang GitHub Pages
app.use(express.json()); // Para mabasa ang JSON bodies

// 2. Routes
app.use("/api/moods", moodRoutes);

// 3. Health Check / Test Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running and connected to Render!");
});

app.get("/test-db", async (req, res) => {
  try {
    // Check if db pool exists
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

// 4. Server Listener - CONFIG FOR RENDER
// Huwag i-hardcode ang 3306 o 3000. Gamitin ang process.env.PORT.
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live at port ${PORT}`);
});
