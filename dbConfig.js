const { Client } = require('pg');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER, // Jangan termasuk 'DB_SERVER=' di sini
    database: process.env.DB_NAME,
    port: 5432, // Port PostgreSQL default
};
console.log(config)

const connectToDatabase = async () => {
    const client = new Client(config);
    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

module.exports = connectToDatabase;
