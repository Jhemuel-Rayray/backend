import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; 
import helmet from "helmet"; 
import { rateLimit } from "express-rate-limit"; 
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js"; // ✅ FIXED: Base sa image_e27fc3.png, nasa /routes ito

dotenv.config();

const app = express();

// --- 🌟 EXTRA CREDIT: REQUEST LOGGING ---
app.use(morgan("dev")); 

// --- 🌟 SECURITY: HELMET ---
app.use(helmet()); 

// --- 🌟 EXTRA CREDIT: RATE LIMITING ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { 
    error: "Too many requests from this IP, please try again after 15 minutes." 
  },
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors({
  origin: [
    "https://jhemuel-rayray.github.io",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 🌟 API ROOT ROUTE ---
// Ito ang mag-aayos sa "Cannot GET /api" (image_e199ae.png)
app.get("/api", (req, res) => {
  res.json({
    status: "Success",
    message: "Welcome to My Mood App API",
    endpoints: {
      moods: "/api/moods",
      ai: "/api/ai",
      health: "/health",
      test_db: "/test-db"
    },
    version: "1.0.0"
  });
});

// 3. PART 4: Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API running professionally with Rate Limiting, Helmet, and Morgan"
  });
});

// 4. Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes); 

// Test Route para sa Database
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 as connected");
    res.json({ status: "Success", message: "Connected to Railway MySQL!", data: rows });
  } catch (err) {
    res.status(500).json({ status: "Error", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is live and secured!");
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Professional Server is live at port ${PORT}`);
});