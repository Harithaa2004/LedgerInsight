const userModel = require("../models/userModel");

// Create User
const createUser = async (req, res) => {
  try {
    let { name, email, role, isActive } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const validRoles = [0, 1, 2];
    if (role === undefined || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    if (isActive === undefined) isActive = true;

    // Check if email exists
    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Create user
    const result = await userModel.createUser({
      name,
      email,
      role,
      isActive,
    });

    return res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
};