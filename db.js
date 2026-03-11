import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 1. Initialize environment variables
dotenv.config();

// 2. Define connection details
const access = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 3. Create the pool and export it as 'db'
// This fixes the "does not provide an export named 'db'" error
export const db = mysql.createPool(access);

// 4. (Optional) Test the connection on startup
try {
  await db.getConnection();
  console.log("✅ Database connected successfully.");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}