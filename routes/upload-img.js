const express = require('express');
const sql = require('mssql');
const router = express.Router();
const connectToDatabase = require('../dbConfig');

router.post('/upload-image', async (req, res) => {
  const { image } = req.body; // Ambil data image yang dikirim dari frontend
  if (!image) {
    return res.status(400).json({ message: "No image provided" });
  }
  try {
    const imageBuffer = Buffer.from(image, 'base64'); // Mengonversi base64 ke binary

    const pool = await connectToDatabase();
    
    // Simpan gambar ke database
    await pool.request()
      .input('imageData', sql.VarBinary, imageBuffer)
      .query('INSERT INTO CAROUSEL (image) VALUES (@imageData)');

    res.status(200).json({ message: 'Image uploaded successfully!' });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
