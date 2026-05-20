const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

const roomRouter = require('./routes/roomsRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, 
  })
);

app.get('/', (req, res) => {
  res.send('StudyNook Server Running');
});

app.use('/api/rooms', roomRouter);

module.exports = app;