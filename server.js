import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // Para sa Professional Logging
import { rateLimit } from "express-rate-limit"; // Para sa API Protection
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js";

// 1. Load environment variables
dotenv.config();

const app = express();

// --- 🌟 EXTRA CREDIT: REQUEST LOGGING (Morgan) ---
// Mag-a-appear na sa terminal mo ang bawat request (e.g., GET /health 200)
app.use(morgan("dev")); 

// --- 🌟 EXTRA CREDIT: RATE LIMITING ---
// Proteksyon para hindi ma-spam ang API mo at ang Gemini API Key
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuto
  max: 100, // Limitahan sa 100 requests bawat IP sa loob ng 15 mins
  message: { 
    error: "Too many requests from this IP, please try again after 15 minutes." 
  },
  standardHeaders: true, // I-send ang rate limit info sa headers
  legacyHeaders: false,
});
app.use(limiter);

// 2. Middlewares
app.use(cors({
  origin: "*", 
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

// 5. Server Listener
const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Professional Server is live at port ${PORT}`);
});