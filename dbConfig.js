const { Client } = require('pg');
require('dotenv').config();

// Debug isi variabel lingkungan
console.log("DB Config:");
console.log("User:", process.env.DB_USER);
console.log("Password:", process.env.DB_PASSWORD);
console.log("Host:", process.env.DB_SERVER);  // Ganti 'Server' menjadi 'Host'
console.log("Database:", process.env.DB_NAME);

const PORT = process.env.PORT || 5000; // Gunakan port dari Vercel, atau fallback ke 5000 saat lokal

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER, // Ganti 'server' menjadi 'host'
    database: process.env.DB_NAME,
    port: 5432, // Port default untuk PostgreSQL
};

const connectToDatabase = async () => {
    try {
        const client = new Client(config); // Membuat instance client PostgreSQL
        await client.connect(); // Menjalankan koneksi
        console.log("Database connected successfully!");
        return client; // Mengembalikan client yang telah terkoneksi
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

module.exports = connectToDatabase;
