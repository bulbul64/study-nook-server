const express = require('express');
const cors = require('cors');

const roomRouter = require('./routes/roomsRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('StudyNook Server Running');
});

app.use('/api/rooms', roomRouter);

module.exports = app;