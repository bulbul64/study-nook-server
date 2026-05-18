const router = require('express').Router();
const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

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

router.get('/', async (req, res) => {
  try {
    const db = await connectDB("StudyNook");
    const collection = db.collection('rooms');
    
    const rooms = await collection.find().toArray();
    
    res.status(200).send(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectDB("StudyNook");
    const collection = db.collection('rooms');
    
    const roomId = req.params.id;
    const room = await collection.findOne({ _id: new ObjectId(roomId) });
    
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    
    res.status(200).send(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;