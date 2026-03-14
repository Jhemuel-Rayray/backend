import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js";

// 1. Load environment variables
dotenv.config();

const app = express();

// 2. Middlewares
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 3. System Health Check Endpoint (PART 4)
// Ito ang i-o-open mo sa browser para sa screenshot
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API running"
  });
});

// 4. Main Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes);

// Health Check with DB Connectivity
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 as connected");
    res.json({ status: "Success", message: "Connected to Railway MySQL!", data: rows });
  } catch (err) {
    res.status(500).json({ status: "Error", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is live and healthy!");
});

// 5. Server Listener
const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live at port ${PORT}`);
});