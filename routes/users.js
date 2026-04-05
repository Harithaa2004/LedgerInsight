const express = require("express");
const router = express.Router();

const { createUser, getUsers } = require("../controllers/usersController");
const authorize = require("../middleware/authorize");

// Admin only
router.post("/", authorize("manage_users"), createUser);
router.get("/", authorize("view_users"), getUsers);

module.exports = router;