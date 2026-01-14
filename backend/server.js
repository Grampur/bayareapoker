const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const playersRouter = require('./routes/players');
const sessionsRouter = require('./routes/sessions');
const sessionResultsRouter = require('./routes/sessionResults');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/players', playersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/session-results', sessionResultsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bay Area Poker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});