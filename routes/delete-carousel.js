const express = require("express");
const router = express.Router();
const pool = require("../dbConfig"); // Import database pool
const cors = require("cors");
// 
// Middleware CORS
router.use(cors());

router.delete("/delete-carousel/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM carousel WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        res.json({ success: true, message: "Image deleted successfully!" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ success: false, message: "Failed to delete image" });
    }
});

module.exports = router; 
