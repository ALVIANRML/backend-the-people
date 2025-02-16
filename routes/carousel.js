const express = require("express");
const router = express.Router();
const pool = require("../dbConfig"); // Import database pool
const cors = require("cors");
// 
// Middleware CORS
router.use(cors());

router.post('/upload-image', async (req, res) => {
    const { image } = req.body; // Ambil data image yang dikirim dari frontend
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }
  
    try {
      // Mengonversi gambar dari base64 ke buffer (binary)
      const imageBuffer = Buffer.from(image, 'base64');
  
      // Membuka koneksi ke database
      const client = await pool();
  
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


router.delete("/delete-carousel/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const Client = await pool();
        const result = await Client.query("DELETE FROM carousel WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        res.json({ success: true, message: "Image deleted successfully!" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ success: false, message: "Failed to delete image" });
    }
});

router.get('/get-all-images', async (req, res) => {
    const client = await pool(); // Koneksi ke PostgreSQL menggunakan client

    try {
        // Query untuk mendapatkan semua gambar dari tabel carousel
        const result = await client.query('SELECT id, image FROM carousel');

        if (result.rows.length > 0) {
            const images = result.rows.map(record => {
                const binaryImage = record.image;
                const base64Image = Buffer.from(binaryImage).toString('base64'); // Mengonversi gambar menjadi base64

                return {
                    id: record.id,
                    image: `data:image/png;base64,${base64Image}` // Format base64 untuk gambar
                };
            });

            res.status(200).json(images); // Mengirimkan data gambar dalam format JSON
        } else {
            res.status(404).json({ message: 'No images found' }); // Jika tidak ada gambar
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Server error' }); // Jika terjadi error
    } finally {
        client.end(); // Pastikan koneksi ditutup setelah selesai
    }
});



module.exports = router; 