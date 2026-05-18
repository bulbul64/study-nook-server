const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbInstance = null;

async function connectDB() {
  try {
    if (!dbInstance) {
      await client.connect();
      dbInstance = client.db("StudyNook");
      console.log("MongoDB Connected & Ping OK");
    }
    return dbInstance;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

module.exports = { connectDB };