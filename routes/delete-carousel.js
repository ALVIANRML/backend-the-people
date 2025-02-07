const express = require("express");
const router = express.Router();
const { Pool } = require('pg');
const connectToDatabase = require("../dbConfig");



router.delete("/:id", async (req, res) => {
    const {id} = req.params;

    try{
        await db.query("DELETE FROM carousel WHERE id = ?", [id]);

        res.json({ success: true, message: "Image deleted Successfully!"});
    } catch(error){
        console.error("error deleting image:", error);
        res.status(500).json({ success: false, message: "Failed to delete image" });
    }
})
module.exports = router;