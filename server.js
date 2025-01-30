require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./dbConfig"); // Import koneksi database

const authRoutes = require("./routes/auth");
const uploadRouter = require("./routes/upload-img");
const getRouter = require("./routes/get-img");
const postEvent = require("./routes/upload-events");
const getEvent = require("./routes/get-event");

const app = express(); // Inisialisasi `app` harus dilakukan sebelum digunakan

const corsOptions = {
  origin: 'https://the-people-tau.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Gunakan `app` setelah deklarasi
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test koneksi ke database
app.get("/api/db-status", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as current_time");
        res.json({ message: "Database connected", time: result.rows[0].current_time });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Routes
app.use("/api", authRoutes);
app.use("/api", uploadRouter);
app.use("/api", postEvent);
app.use("/api", getRouter);
app.use("/api", getEvent);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
