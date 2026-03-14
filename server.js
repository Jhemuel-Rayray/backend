import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // Para sa Automated Logging
import { rateLimit } from "express-rate-limit"; // Para sa API Protection
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();
const app = express();

// --- EXTRA CREDIT: REQUEST LOGGING (Morgan) ---
// Mag-o-automate ng log sa terminal tuwing may tatawag sa API (GET, POST, etc.)
app.use(morgan("dev")); 

// --- EXTRA CREDIT: RATE LIMITING ---
// Nililimitahan nito ang request sa 100 kada 15 minuto para iwas-spam.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "OPTIONS"] }));
app.use(express.json());

// PART 4: Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API running professionally" });
});

// Routes
app.use("/api/moods", moodRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend is live with Morgan and Rate Limiting!");
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Professional Server live at port ${PORT}`);
});