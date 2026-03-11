import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config(); // Must be at the very top!

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
};

// Log this to see if it's undefined
console.log("Database Config:", dbConfig); 

const pool = mysql.createPool(dbConfig);

export default pool;