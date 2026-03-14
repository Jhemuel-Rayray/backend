// db.js

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // 🔴 BUG #2 - Sadyang maling password para mag-fail ang connection
  password: 'wrongpassword', 
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 52432,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});