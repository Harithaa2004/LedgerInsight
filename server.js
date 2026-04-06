// Load environment variables first
require("dotenv").config();

const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Custom middleware
const mockAuth = require("./middleware/mockAuth");
app.use(mockAuth);

// Routes
const userRoutes = require("./routes/users");
const recordRoutes = require("./routes/records");
const dashboardRoutes = require("./routes/dashboard");

app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("Finance Backend API is running");
});

// Global error handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});