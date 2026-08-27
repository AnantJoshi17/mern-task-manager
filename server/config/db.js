// config/db.js
// One job: open the connection to MongoDB.
// We keep it in its own file so server.js stays short and readable.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we await it.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    // If we cannot reach the database there is no point in running the server.
    process.exit(1);
  }
};

module.exports = connectDB;
