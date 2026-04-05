const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const authorize = require("../middleware/authorize");

// Analyst + Admin can view dashboard
router.get("/", getDashboard);

module.exports = router;