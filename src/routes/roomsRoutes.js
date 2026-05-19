const router = require('express').Router();
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const JWKS = createRemoteJWKSet(
  new URL('http://localhost:3000/api/auth/jwks')
)

// Middleware to verify token
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
 
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  console.log(token);
  next();
  try{
   const { payload } = await jwtVerify(token, JWKS, )
   console.log(payload)
   next();

   } catch (error) {
     return res.status(401).send({ message: 'Unauthorized' });
   }   
}

 

// Create a new room
router.post('/', async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

    const room = req.body;
    const result = await collection.insertOne(room);

    res.status(201).send(result);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Create a new booking
router.post('/bookings', async (req, res) => {
  const db = await connectDB('StudyNook');
  const collection = db.collection('bookings');
  const booking = req.body;
  const result = await collection.insertOne(booking);
  res.status(201).send(result);
  
})



// Get all rooms
router.get('/', async (req, res, next) => {
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
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

    const roomId = req.params.id;
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

router.patch('/:id', async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

    const roomId = req.params.id;
    const updates = req.body;

    delete updates._id;

    const result = await collection.updateOne({ _id: new ObjectId(roomId) }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Room not found' });
    }

    res.status(200).send({ message: 'Room updated successfully', result });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Delete a specific room
router.delete('/:id', async (req, res) => {
  try {
    const db = await connectDB('StudyNook');
    const collection = db.collection('rooms');

    const roomId = req.params.id;

    const result = await collection.deleteOne({ _id: new ObjectId(roomId) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Room not found' });
    }

    res.status(200).send({ message: 'Room deleted successfully', result });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



module.exports = router;
