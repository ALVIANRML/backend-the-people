const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const sql = require("mssql");

router.get('/get-event', async (req, res) => {
    try {
        
        const pool = await connectToDatabase();
      const result = await pool.request().query('SELECT * FROM Event');
      res.status(200).json(result.recordset);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  module.exports = router;