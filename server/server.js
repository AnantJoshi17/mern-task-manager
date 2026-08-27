// server.js
// The entry point of the backend. Run it with: npm run dev

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

// Load the values from .env into process.env. Must happen before we use them.
dotenv.config();

// Open the MongoDB connection.
connectDB();

const app = express();

// ---- Middleware: functions that run on every request, in this order ----

// The React app runs on a different address to the API. Browsers block requests
// between different origins unless the server allows it. cors() allows it.
//
// In production we set CLIENT_URL so only our own frontend can call the API.
// Locally CLIENT_URL is not set, so '*' lets anything through, which is
// convenient while developing.
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Without this, req.body would be undefined. It parses incoming JSON.
app.use(express.json());

// ---- Routes ----

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

// Every URL starting with /api/tasks is handled by taskRoutes.
app.use('/api/tasks', taskRoutes);

// If no route above matched, we land here.
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
