const express = require("express");
const router = express.Router();
const connectToDatabase = require("../dbConfig");
const { req } = require("agent-base");
const { message } = require("statuses");
const { v4: uuidv4 } = require('uuid');

//get event
router.get('/get-event', async (req, res) => {
  const { month } = req.query;
  const client = await connectToDatabase();

  try {
    let result;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      // Jika month tidak valid, ambil semua event
      result = await client.query('SELECT * FROM event');
    } else {
      // Jika month valid, ambil event berdasarkan bulan
      result = await client.query(
        'SELECT * FROM event WHERE EXTRACT(MONTH FROM eventDate) = $1',
        [month]
      );
    }

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
      return res.status(404).json({ message: "Event Not Found" });
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



// add event
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

// delete event
router.delete('/delete-event/:id', async (req,res) =>{
  const {id} = req.params;
  const client = await connectToDatabase();
  try{
  const result = await client.query('DELETE FROM event WHERE id = $1 RETURNING * ', [id]);

  if (result.rowCount == 0){
    return req.status(404).json ({
      success:false, message:"Event Not Found"
    });
  } else{
    res.json({success:true, message: "Event Delete Successfully"});
  }
  }catch(error){
    console.error("this is the error" , error)
  }
})
module.exports = router;
