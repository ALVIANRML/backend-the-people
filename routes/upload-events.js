const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { Pool } = require('pg'); // Import Pool dari pg untuk koneksi database

// Koneksi pool ke PostgreSQL
const pool = new Pool({
  user: 'postgres',           // Ganti dengan username database Anda
  host: 'localhost',          // Ganti dengan host database Anda
  database: 'the_people',  // Ganti dengan nama database Anda
  password: 'password',       // Ganti dengan password database Anda
  port: 5432,                 // Ganti dengan port PostgreSQL Anda jika berbeda
});

router.post('/save-event', async (req, res) => {
  const { eventName, eventDate, eventType, eventLink } = req.body;

  // Array untuk menyimpan field yang kosong
  const missingFields = [];
  if (!eventName) missingFields.push('eventName');
  if (!eventDate) missingFields.push('eventDate');
  if (!eventType) missingFields.push('eventType');
  if (!eventLink) missingFields.push('eventLink');

  // Jika ada field yang kosong, kembalikan respons dengan informasi spesifik
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Some fields are missing',
      missingFields: missingFields,
    });
  }

  try {
    // Membuat UUID untuk id
    const id = uuidv4();

    // Query untuk menyimpan data
    const query = `
      INSERT INTO Event (id, eventName, eventDate, eventType, eventLink)
      VALUES ($1, $2, $3, $4, $5)
    `;

    // Eksekusi query dengan parameter menggunakan pool.query
    await pool.query(query, [id, eventName, eventDate, eventType, eventLink]);

    // Mengirimkan respons sukses
    return res.status(201).json({
      message: 'Event saved successfully',
      data: { id, eventName, eventDate, eventType, eventLink },
    });

  } catch (error) {
    // Menangani error jika query atau koneksi gagal
    console.error('Error saving event:', error.stack);
    return res.status(500).json({ error: 'Failed to save event' });
  }
});

module.exports = router;
