const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const playersRouter = require('./routes/players');
const sessionsRouter = require('./routes/sessions');
const sessionResultsRouter = require('./routes/sessionResults');
const migrateRoutes = require('./routes/migrate');

const app = express();
const PORT = process.env.PORT || 3001;

// Improved CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://bayareapoker-frontend.onrender.com',
    'https://bayareapoker-frontend.onrender.com/'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/players', playersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/session-results', sessionResultsRouter);
app.use('/api/migrate', migrateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bay Area Poker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});