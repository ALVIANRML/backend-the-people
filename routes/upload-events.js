const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const pool = require('../dbConfig'); // Mengimpor pool dari dbConfig

router.post('/save-event', async (req, res) => {
  const { eventName, eventDate, eventType, eventLink } = req.body;

  // Validasi input
  const missingFields = [];
  if (!eventName) missingFields.push('eventName');
  if (!eventDate) missingFields.push('eventDate');
  if (!eventType) missingFields.push('eventType');
  if (!eventLink) missingFields.push('eventLink');

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
    console.error('Error saving event:', error.message);
    return res.status(500).json({ error: 'Failed to save event' });
  }
});

// Export router
module.exports = router;
