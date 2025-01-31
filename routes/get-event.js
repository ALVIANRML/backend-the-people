const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");

// Ambil data event bulan tertentu
router.get('/get-event', async (req, res) => {
  const { month } = req.query;

  // Validasi input
  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      message: "Month parameter is required and must be a number between 1 and 12",
    });
  }

  try {
    const client = await connectToDatabase();
    // Query untuk mendapatkan event berdasarkan bulan
    const result = await client.query(
      'SELECT * FROM event WHERE EXTRACT(MONTH FROM eventDate) = $1',
      [month]
    );

    // Mengembalikan data event yang ditemukan
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
      return res.status(404).json({ message: "No events found for the specified month" });
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
