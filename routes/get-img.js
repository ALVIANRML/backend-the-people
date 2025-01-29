const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig"); // Pastikan Anda menggunakan connectToDatabase yang benar

router.get('/get-all-images', async (req, res) => {
    const client = await connectToDatabase(); // Koneksi ke PostgreSQL menggunakan client

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
