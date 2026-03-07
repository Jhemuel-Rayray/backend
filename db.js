import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Mas mainam gamitin ang DATABASE_URL o MYSQL_URL para sa Railway
const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL;

console.log("🚀 Connecting to database...");

export const db = mysql.createPool({
  uri: connectionString,
  // Mahalaga ito para sa Render-to-Railway connection
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});