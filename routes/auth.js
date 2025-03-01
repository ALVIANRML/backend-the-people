const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Middleware CORS
router.use(cors());

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Koneksi ke PostgreSQL
        const client = await connectToDatabase();
        
        // Menjalankan query untuk mencocokkan username dan password
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        
        // Mengecek hasil query
        if (result.rows.length > 0) {
            // Membuat JWT token jika login berhasil
            const token = jwt.sign(
                { username: username },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );
            
            res.status(200).json({
                message: "Login successful",
                redirectTo: "/dashboard",
                token: token
            });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }

        // Menutup koneksi setelah query selesai
        await client.end();
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
