const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const uploadRouter = require('./routes/upload-img');
const getRouter = require('./routes/get-img')

const app = express();

// Middleware
app.use(cors()); // Untuk mengizinkan request dari domain lain (CORS)
app.use(express.json({ limit: '10mb' })); // Untuk mem-parsing JSON dengan limit ukuran
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Untuk mem-parsing data URL-encoded dengan limit ukuran
app.use(bodyParser.json()); // Untuk mem-parsing JSON
app.use(bodyParser.urlencoded({ extended: true })); // Untuk mem-parsing data URL-encoded

// Routes
// POST
app.use("/api", authRoutes); 
app.use('/api', uploadRouter); 

// GET
app.use("/api", getRouter); 


// Menjalankan server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
