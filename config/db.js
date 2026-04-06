const mysql = require("mysql2");
// console.log("DB FILE LOADED");
require("dotenv").config();
// console.log("ENV CHECK:", process.env.DB_USER);
// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: Check DB connection once at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
    connection.release();
  }
});
// Export promise-based pool
module.exports = pool.promise();