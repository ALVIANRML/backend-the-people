const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const sql = require("mssql");

// Ambil data event bulan tertentu
router.get('/get-event', async (req, res) => {
  const { month } = req.query; // Ambil bulan dari query parameter
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('month', sql.Int, month) // Parameter bulan
      .query('SELECT * FROM Event WHERE MONTH(eventDate) = @month'); // Filter berdasarkan bulan
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
    res.status(500).json({ error });
  }
});

module.exports = router;
