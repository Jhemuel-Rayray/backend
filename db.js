import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 52432,
  waitForConnections: true,
  connectionLimit: 10,
  // ADD THIS SECTION:
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = pool;

// This is the part that generates your log message
try {
  await db.getConnection();
  console.log("✅ Database connected successfully!");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}