const db = require("../config/db");

// Check if email exists
const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

const createUser = async ({ name, email, role, isActive }) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, role, isActive) VALUES (?, ?, ?, ?)",
    [name, email, role, isActive]
  );
  return result;
};

const getAllUsers = async () => {
  const [rows] = await db.query(`
    SELECT id, name, email, role, isActive, createdAt, updatedAt
    FROM users
    WHERE isActive = true
  `);
  return rows;
};

module.exports = {
  findUserByEmail,
  createUser,
  getAllUsers,
};