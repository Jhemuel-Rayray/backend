import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; 
import { rateLimit } from "express-rate-limit"; 
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js"; // 👈 Dito naka-connect ang AI logic mo

dotenv.config();

const app = express();

// --- 🌟 EXTRA CREDIT: REQUEST LOGGING ---
app.use(morgan("dev")); 

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
app.use(require("helmet")());


app.use(cors({
  origin: [
    "https://jhemuel-rayray.github.io",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// 3. PART 4: Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API running professionally with Rate Limiting and Morgan"
  });
});

// 4. Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes); // 👈 Siguraduhin na 'gemini-1.5-flash' ang nasa loob nito

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