import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// DEBUGGING LOGS: Run node server.js and check your terminal!
console.log("Attempting to connect to host:", process.env.DB_HOST);
console.log("Using Port:", process.env.DB_PORT);

export const db = mysql.createPool({
  host: process.env.DB_HOST,      // If this is undefined, it defaults to localhost
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});