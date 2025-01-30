const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

// Login route
router.post(
    "/login",
    [
        body("username").isString().notEmpty(),
        body("password").isString().notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const client = await connectToDatabase();

            // Query hanya untuk username
            const result = await client.query(
                "SELECT * FROM users WHERE username = $1",
                [username]
            );

            if (result.rows.length > 0) {
                const user = result.rows[0];

                // Verifikasi password
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
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
                    res.status(401).json({ message: "Invalid credentials" });
                }
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

module.exports = router;
