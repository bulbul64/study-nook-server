const router = require('express').Router();
const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Middleware to verify session directly using Better-Auth Next.js endpoint
async function verifyToken(req, res, next) {

  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(401).send({ message: 'Unauthorized: No cookie found' });
  }

  try {
    
    const response = await fetch('http://localhost:3000/api/auth/get-session', {
      method: 'GET',
      headers: {
        'cookie': cookieHeader 
      }
    });

    if (!response.ok) {
      return res.status(401).send({ message: 'Unauthorized: Invalid session' });
    }

    const sessionData = await response.json();
   
    if (!sessionData || !sessionData.user) {
      return res.status(401).send({ message: 'Unauthorized: User not found in session' });
    }

    
    req.user = sessionData.user; 
    next();
  } catch (error) {
    console.error("Session verification failed:", error.message);
    return res.status(401).send({ message: 'Unauthorized: Server verification error' });
  }
}

// Create a new booking
router.post('/bookings', verifyToken, async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('bookings');
    const booking = {
      ...req.body,
      userId: req.user.id 
    };
    const result = await collection.insertOne(booking);
    res.status(201).send(result);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get all my bookings
router.get('/bookings/me', verifyToken, async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('bookings');
    const result = await collection.find({ userId: req.user.id }).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Create a new room
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

    const room = {
      ...req.body,
      ownerId: req.user.id 
    };
    const result = await collection.insertOne(room);
    res.status(201).send(result);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }  
});  

// Get all my rooms
router.get('/my-rooms', verifyToken, async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');
    
   
    const result = await collection.find({ ownerId: req.user.id }).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error('Error fetching my rooms:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get all rooms
router.get('/',  async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');
    const rooms = await collection.find().toArray();
    res.status(200).send(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get a specific room
router.get('/:id',  async (req, res) => {
  try {
    const roomId = req.params.id;
    
    if (!ObjectId.isValid(roomId)) {
      return res.status(400).send({ message: 'Invalid Room ID format' });
    }

    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');
    const room = await collection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    res.status(200).send(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Update a specific room 
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const roomId = req.params.id;

    if (!ObjectId.isValid(roomId)) {
      return res.status(400).send({ message: 'Invalid Room ID format' });
    }

    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

    
    const room = await collection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

   
    if (room.ownerId !== req.user.id) {
      return res.status(403).send({ message: 'Forbidden: You can only update your own rooms' });
    }

    const updates = req.body;
    delete updates._id; 

  
    const result = await collection.updateOne({ _id: new ObjectId(roomId) }, { $set: updates });

    res.status(200).send({ message: 'Room updated successfully', result });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Delete a specific room
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const roomId = req.params.id;

    if (!ObjectId.isValid(roomId)) {
      return res.status(400).send({ message: 'Invalid Room ID format' });
    }

    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

 
    const room = await collection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

  
    if (room.ownerId !== req.user.id) {
      return res.status(403).send({ message: 'Forbidden: You can only delete your own rooms' });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(roomId) });

    res.status(200).send({ message: 'Room deleted successfully', result });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;