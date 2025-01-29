const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const uploadRouter = require('./routes/upload-img');
const getRouter = require('./routes/get-img');
const postEvent = require('./routes/upload-events');
const getEvent = require('./routes/get-event');

const app = express();
const corsOptions = {
  origin: 'https://the-people-tau.vercel.app/', // Izinkan semua domain (sementara, bisa diganti dengan URL frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Untuk mem-parsing JSON dengan limit ukuran
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Untuk mem-parsing data URL-encoded dengan limit ukuran
app.use(bodyParser.json()); // Untuk mem-parsing JSON
app.use(bodyParser.urlencoded({ extended: true })); // Untuk mem-parsing data URL-encoded

// Route untuk mengecek koneksi antara frontend dan backend
app.get('/api/status', (req, res) => {
    res.json({ message: 'Frontend berhasil terhubung ke backend!' });
});

// Routes
// POST
app.use("/api", authRoutes);
app.use('/api', uploadRouter);
app.use('/api', postEvent);

// GET
app.use("/api", getRouter);
app.use("/api", getEvent);

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
