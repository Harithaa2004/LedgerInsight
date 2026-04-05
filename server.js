const express = require("express");
const app = express();
console.log("RECORDS ROUTE LOADED");
const mockAuth = require("./middleware/mockAuth");
const userRoutes = require("./routes/users");
const recordRoutes = require("./routes/records");
const dashboardRoutes = require("./routes/dashboard");

// Middleware
app.use(express.json());
app.use(mockAuth); // ✅ apply globally

// Routes
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);
// Server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});