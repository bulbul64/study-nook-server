const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

const roomRouter = require('./routes/roomsRoutes');

const app = express();


app.use(express.json());
app.use(cookieParser()); 


const allowedOrigins = [
  'http://localhost:3000',
  'https://study-nook-client-dun.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);


app.get('/', (req, res) => {
  res.send('StudyNook Server Running');
});

app.use('/api/rooms', roomRouter);

module.exports = app;