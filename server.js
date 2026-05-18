const dns = require('dns');
dns.setServers(['8.8.8.8']);

const app = require('./src/app');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error("Failed to start server due to DB connection issues:", err);
});