const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const sql = require("mssql");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await connectToDatabase();
        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .input("password", sql.NVarChar, password)
            .query(
                "SELECT * FROM dbo.Users WHERE username = @username AND password = @password"
            );
            const token = jwt.sign(
                { username: username },
                process.env.JWT_SECRET_KEY, // Ubah ke secret key yang aman
                { expiresIn: "1h" } // Token berlaku selama 1 jam
            );
        if (result.recordset.length > 0) {
            res.status(200).json({ message: "Login successful",redirectTo: "/dashboard"  });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
