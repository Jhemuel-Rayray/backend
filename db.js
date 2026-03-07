import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Babasahin nito ang DATABASE_URL na nilagay mo sa Render
const connectionString = process.env.DATABASE_URL;

export const db = mysql.createPool({
  uri: connectionString, 
  ssl: {
    rejectUnauthorized: false // Mahalaga ito para sa Railway connection
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});