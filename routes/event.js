const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");

// Ambil data event bulan tertentu
router.get('/get-event', async (req, res) => {
  const { month } = req.query;

  // Validasi input
  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      message: "Month parameter is required and must be a number between 1 and 12",
    });
  }

  try {
    const client = await connectToDatabase();
    // Query untuk mendapatkan event berdasarkan bulan
    const result = await client.query(
      'SELECT * FROM event WHERE EXTRACT(MONTH FROM eventDate) = $1',
      [month]
    );

    // Mengembalikan data event yang ditemukan
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
     
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
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
    const client = await connectToDatabase();
    // Query untuk menyimpan data
    const query = `
      INSERT INTO Event (id, eventName, eventDate, eventType, eventLink)
      VALUES ($1, $2, $3, $4, $5)
    `;

    // Eksekusi query dengan parameter menggunakan pool.query
    await client.query(query, [id, eventName, eventDate, eventType, eventLink]);

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
