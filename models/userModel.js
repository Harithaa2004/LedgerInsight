const db = require("../config/db");

// Check if email exists
const findUserByEmail = (email, callback) => {
  const query = "SELECT id FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

// Create user
const createUser = (userData, callback) => {
  const { name, email, role, isActive } = userData;

  const query =
    "INSERT INTO users (name, email, role, isActive) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, role, isActive], callback);
};

// Get all active users
const getAllUsers = (callback) => {
  const query = `
    SELECT id, name, email, role, isActive, createdAt, updatedAt
    FROM users
    WHERE isActive = true
  `;

  db.query(query, callback);
};

module.exports = {
  findUserByEmail,
  createUser,
  getAllUsers,
};