const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");

// Ambil data event bulan tertentu
router.get('/get-event', async (req, res) => {
  const { month } = req.query; // Ambil bulan dari query parameter
  if (!month) {
    return res.status(400).json({ message: "Month parameter is required" });
  }
  
  try {
    const client = await connectToDatabase();

    // Query untuk mendapatkan event berdasarkan bulan
    const result = await client.query(
      'SELECT * FROM event WHERE EXTRACT(MONTH FROM eventDate) = $1', // Menggunakan EXTRACT untuk bulan
      [month] // Menggunakan parameter PostgreSQL
    );

    // Mengembalikan data event yang ditemukan
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No events found for the specified month' });
    }

    // Menutup koneksi setelah query selesai
    await client.end();
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
