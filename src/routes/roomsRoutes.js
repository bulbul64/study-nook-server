const router = require('express').Router();
const { connectDB } = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const db = await connectDB("StudyNook");
    const collection = db.collection('rooms');
    
    const room = req.body;
    const result = await collection.insertOne(room);
    
    res.status(201).send(result);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;