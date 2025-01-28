const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const uploadRouter = require('./routes/upload-img');
const getRouter = require('./routes/get-img');
const postEvent = require('./routes/upload-events');
const getEvent = require('./routes/get-event');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'the-people-git-master-yannns-projects.vercel.app', // Ganti dengan domain frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan metode-metode tertentu
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS globally with custom options
app.use(express.json({ limit: '10mb' })); // Untuk mem-parsing JSON dengan limit ukuran
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Untuk mem-parsing data URL-encoded dengan limit ukuran
app.use(bodyParser.json()); // Untuk mem-parsing JSON
app.use(bodyParser.urlencoded({ extended: true })); // Untuk mem-parsing data URL-encoded

// Routes
// POST
app.use("/api", authRoutes);
app.use('/api', uploadRouter);
app.use('/api', postEvent);

// GET
app.use("/api", getRouter);
app.use("/api", getEvent);

// Menjalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
