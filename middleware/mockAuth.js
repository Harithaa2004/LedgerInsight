const db = require("../config/db");

async function mockAuth(req, res, next) {
  try {
    const userId = req.header("x-user-id") || 1;
    const role = req.header("x-user-role") || 0;

    // 🔍 Fetch user status
    const [userResult] = await db.query(
      "SELECT isActive FROM users WHERE id = ?",
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userResult[0].isActive) {
      return res.status(403).json({ error: "User is inactive" });
    }

    req.user = {
      id: Number(userId),
      role: Number(role)
    };

    next();

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = mockAuth;