import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Option A: Kung gusto mong gamitin ang mahabang URL (recommeded for Railway)
// Gumawa ka ng variable sa Render na ang pangalan ay DATABASE_URL 
// at ang value ay yung buong mysql:// string mo.
const connectionString = process.env.DATABASE_URL || process.env.DB_HOST;

export const db = mysql.createPool({
  uri: connectionString, // Gagamit ng URI para hindi na malito sa host
  ssl: {
    rejectUnauthorized: false // Mahalaga ito para sa Render-to-Railway connection
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});