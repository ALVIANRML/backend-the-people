const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const sql = require("mssql");

router.get('/get-all-images', async (req, res) => {
    try {
        const pool = await connectToDatabase();

        // Query untuk mendapatkan semua gambar
        const result = await pool.request().query('SELECT id, image FROM CAROUSEL');

        if (result.recordset.length > 0) {
            const images = result.recordset.map(record => {
                const binaryImage = record.image;
                const base64Image = Buffer.from(binaryImage).toString('base64'); // Konversi ke Base64

                return {
                    id: record.id,
                    image: `data:image/png;base64,${base64Image}`
                };
            });

            res.status(200).json(images);
        } else {
            res.status(404).json({ message: 'No images found' });
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: error });
        // res.status(500).json({  });
    }
});

module.exports = router;
