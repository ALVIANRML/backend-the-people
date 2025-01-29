const { Client } = require('pg');
require('dotenv').config();
console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_SERVER, process.env.DB_NAME);

// Pastikan DB_SERVER berisi alamat server tanpa `DB_SERVER=`
// Misalnya: DB_SERVER=127.0.0.1
const config = {
    user: process.env.DB_USER,       // Username untuk koneksi
    password: process.env.DB_PASSWORD,  // Password untuk koneksi
    host: process.env.DB_SERVER,     // Host, misalnya '127.0.0.1'
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
