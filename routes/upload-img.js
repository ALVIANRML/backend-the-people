const express = require('express');
const router = express.Router();
const connectToDatabase = require('../dbConfig'); // Pastikan Anda menggunakan koneksi PostgreSQL yang benar

router.post('/upload-image', async (req, res) => {
  const { image } = req.body; // Ambil data image yang dikirim dari frontend
  if (!image) {
    return res.status(400).json({ message: "No image provided" });
  }

  try {
    // Mengonversi gambar dari base64 ke buffer (binary)
    const imageBuffer = Buffer.from(image, 'base64');

    // Membuka koneksi ke database
    const client = await connectToDatabase();

    // Simpan gambar ke dalam tabel carousel (PostgreSQL)
    await client.query(
      'INSERT INTO carousel (image) VALUES ($1)', // $1 adalah placeholder untuk parameter
      [imageBuffer] // Parameter yang akan dimasukkan dalam query
    );

    res.status(200).json({ message: 'Image uploaded successfully!' });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
