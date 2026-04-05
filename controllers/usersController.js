const userModel = require("../models/userModel");

// Create User
const createUser = (req, res) => {
  try {
    let { name, email, role, isActive } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const validRoles = [0, 1, 2];
    if (role === undefined || !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    if (isActive === undefined) isActive = true;

    // Check email
    userModel.findUserByEmail(email, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length > 0) {
        return res.status(400).json({ error: "Email already exists." });
      }

      // Create user
      userModel.createUser(
        { name, email, role, isActive },
        (err2, result2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          return res.status(201).json({
            message: "User created successfully",
            userId: result2.insertId,
          });
        }
      );
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Users
const getUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
};

module.exports = {
  createUser,
  getUsers,
};