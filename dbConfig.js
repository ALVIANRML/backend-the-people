const sql = require('mssql');
require('dotenv').config();
// Debug isi variabel lingkungan
console.log("DB Config:");
console.log("User:", process.env.DB_USER);
console.log("Password:", process.env.DB_PASSWORD);
console.log("Server:", process.env.DB_SERVER);
console.log("Database:", process.env.DB_NAME);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        enableArithAbort: true,
    },
};

const connectToDatabase = async () => {
    try {
        return await sql.connect(config);
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

module.exports = connectToDatabase;
