const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db"); // Import the pool

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON body

// Test database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connection successful");
    connection.release();
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Routes
const authRoutes = require("./server/routes/auth-routes");
const trainRoutes = require("./server/routes/trains");
const bookingRoutes = require("./server/routes/booking");

app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/auth", bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = pool;
