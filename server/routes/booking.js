const express = require("express")
const router = express.Router()
const { verifyToken } = require("./auth-routes")
const pool = require("../../server")

// Book a seat
router.post("/", verifyToken, async (req, res) => {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const { train_id, passengers } = req.body
    const user_id = req.user.id

    // Check train availability
    const [trains] = await connection.query("SELECT available_seats FROM trains WHERE id = ? FOR UPDATE", [train_id])

    if (trains.length === 0) {
      await connection.rollback()
      return res.status(404).json({ message: "Train not found" })
    }

    const train = trains[0]
    if (train.available_seats < passengers.length) {
      await connection.rollback()
      return res.status(400).json({ message: "Not enough seats available" })
    }

    // Book seats for each passenger
    const bookingPromises = passengers.map(async (passenger, index) => {
      const seat_number = train.available_seats - index
      await connection.query(
        `INSERT INTO bookings (
          user_id, 
          train_id, 
          passenger_name, 
          passenger_age, 
          passenger_gender, 
          passenger_email,
          seat_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, train_id, passenger.name, passenger.age, passenger.gender, passenger.email, seat_number],
      )
    })

    await Promise.all(bookingPromises)

    // Update available seats
    await connection.query("UPDATE trains SET available_seats = available_seats - ? WHERE id = ?", [
      passengers.length,
      train_id,
    ])

    await connection.commit()
    res.status(201).json({ message: "Booking successful" })
  } catch (error) {
    await connection.rollback()
    console.error("Booking error:", error)
    res.status(500).json({ message: "Server error while booking" })
  } finally {
    connection.release()
  }
})

// Get user's bookings
router.get("/", verifyToken, async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, t.train_number, t.train_name, t.source, t.destination, 
              t.departure_datetime, t.arrival_datetime
       FROM bookings b
       JOIN trains t ON b.train_id = t.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [req.user.id],
    )

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Server error while getting bookings" })
  }
})

module.exports = router

