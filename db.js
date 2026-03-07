import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Babasahin nito ang DATABASE_URL na nilagay mo sa Render Environment Variables
const connectionString = process.env.DATABASE_URL;

export const db = mysql.createPool({
  // GAMITIN ANG uri PROPERTY PARA SA FULL CONNECTION STRING
  uri: connectionString, 
  ssl: {
    rejectUnauthorized: false // Mahalaga ito para sa koneksyon sa Railway
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});