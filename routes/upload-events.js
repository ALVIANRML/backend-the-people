const express = require('express');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid'); // Import fungsi untuk membuat UUID
const router = express.Router();
const connectToDatabase = require('../dbConfig');

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
      missingFields: missingFields, // Mengembalikan nama field yang kosong
    });
  }

  try {
    // Koneksi ke database
    const pool = await connectToDatabase();

    // Membuat UUID untuk id
    const id = uuidv4();

    // Query untuk menyimpan data
    const query = `
      INSERT INTO Event (id, eventName, eventDate, eventType, eventLink)
      VALUES (@id, @eventName, @eventDate, @eventType, @eventLink)
    `;

    // Eksekusi query dengan parameter
    await pool.request()
      .input('id', sql.VarChar, id) // UUID disimpan di kolom `id`
      .input('eventName', sql.VarChar, eventName)
      .input('eventDate', sql.Date, eventDate)
      .input('eventType', sql.VarChar, eventType)
      .input('eventLink', sql.VarChar, eventLink)
      .query(query);

    res.status(201).json({
      message: 'Event saved successfully',
      data: { id, eventName, eventDate, eventType, eventLink },
    });
  } catch (error) {
    console.error('Error saving event:', error.message);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

module.exports = router;
