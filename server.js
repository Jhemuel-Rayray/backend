import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Pinapayagan ang lahat ng origins (GitHub Pages)
app.use(express.json()); // Importante para mabasa ang POST request body

// Routes
app.use("/api/moods", moodRoutes);

// Test DB route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ status: "DB Connected", rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running and connected!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});