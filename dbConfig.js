const { Client } = require('pg');
require('dotenv').config();

// Pastikan DB_SERVER berisi alamat server tanpa `DB_SERVER=`
// Misalnya: DB_SERVER=127.0.0.1
const config = {
    user: process.env.DB_USER,       // Username untuk koneksi
    password: process.env.DB_PASSWORD,  // Password untuk koneksi
    host: "127.0.0.1",     // Host, misalnya '127.0.0.1'
    database: process.env.DB_NAME,   // Nama database yang ingin digunakan
    port: 5432,                      // Port default PostgreSQL
};

console.log(config);

const connectToDatabase = async () => {
    const client = new Client(config);
    try {
        await client.connect();
        console.log("Database connected successfully!");
        return client;  // Mengembalikan client yang terhubung
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;  // Menangani error jika koneksi gagal
    }
};

module.exports = connectToDatabase;
