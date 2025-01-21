const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("./auth-routes");
const pool = require("../../db"); // Ensure this imports the correct pool

// Add new train (No token validation required)
router.post("/add-train", async (req, res) => {
  try {
    const {
      train_number,
      train_name,
      source,
      destination,
      departure_datetime,
      arrival_datetime,
      total_seats,
    } = req.body;

    // Validate that all required fields are provided
    if (
      !train_number ||
      !train_name ||
      !source ||
      !destination ||
      !departure_datetime ||
      !arrival_datetime ||
      !total_seats
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert new train into the database
    const [result] = await pool.query(
      `INSERT INTO trains (
        train_number, 
        train_name, 
        source, 
        destination, 
        departure_datetime, 
        arrival_datetime, 
        total_seats,
        available_seats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        train_number,
        train_name,
        source,
        destination,
        departure_datetime,
        arrival_datetime,
        total_seats,
        total_seats,
      ]
    );

    // Respond with success message and new train ID
    res.status(201).json({
      message: "Train added successfully",
      trainId: result.insertId,
    });
  } catch (error) {
    console.error("Add train error:", error);
    res.status(500).json({ message: "Server error while adding train" });
  }
});

// Add new train (Only if token is verified)
router.post("/admin/add-train", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      train_number,
      train_name,
      source,
      destination,
      departure_datetime,
      arrival_datetime,
      total_seats,
    } = req.body;

    // Validate that all required fields are provided
    if (
      !train_number ||
      !train_name ||
      !source ||
      !destination ||
      !departure_datetime ||
      !arrival_datetime ||
      !total_seats
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert new train into the database
    const [result] = await pool.query(
      `INSERT INTO trains (
        train_number, 
        train_name, 
        source, 
        destination, 
        departure_datetime, 
        arrival_datetime, 
        total_seats,
        available_seats
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        train_number,
        train_name,
        source,
        destination,
        departure_datetime,
        arrival_datetime,
        total_seats,
        total_seats,
      ]
    );

    // Respond with success message and new train ID
    res.status(201).json({
      message: "Train added successfully by admin",
      trainId: result.insertId,
    });
  } catch (error) {
    console.error("Add train error:", error);
    res.status(500).json({ message: "Server error while adding train" });
  }
});

// Search trains
router.get("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source && !destination && !date) {
      return res.status(400).json({ message: "Please provide at least one search criteria" });
    }

    let query = "SELECT * FROM trains WHERE ";
    let queryParams = [];
    let conditionCount = 0;

    if (source) {
      query += "source = ? ";
      queryParams.push(source);
      conditionCount++;
    }

    if (destination) {
      if (conditionCount > 0) query += "AND ";
      query += "destination = ? ";
      queryParams.push(destination);
      conditionCount++;
    }

    if (date) {
      if (conditionCount > 0) query += "AND ";
      query += "DATE(departure_datetime) = ? ";
      queryParams.push(date);
      conditionCount++;
    }

    if (conditionCount < 2) {
      return res.status(404).json({ message: "No such train available" });
    }

    const [trains] = await pool.query(query, queryParams);

    if (trains.length === 0) {
      return res.status(404).json({ message: "No such train available" });
    }

    res.json(trains);
  } catch (error) {
    console.error("Search trains error:", error);
    res.status(500).json({ message: "Server error while searching trains" });
  }
});

// Get train by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [trains] = await pool.query("SELECT * FROM trains WHERE id = ?", [id]);

    if (trains.length === 0) {
      return res.status(404).json({ message: "Train not found" });
    }

    res.json(trains[0]);
  } catch (error) {
    console.error("Get train error:", error);
    res.status(500).json({ message: "Server error while getting train" });
  }
});

module.exports = router;
