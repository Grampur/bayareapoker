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

const corsOptions = {
  origin: [
    'https://bayareapoker.vercel.app/',
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
// const allowedOrigins = new Set([
//     'http://localhost:3000',
//     'https://bayareapoker.vercel.app/',
//     'https://bayareapoker.onrender.com/'
// ]);

// app.use(cors({
//   origin: (origin, callback) => {
//     // allow non-browser requests (curl, Postman)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.has(origin)) {
//       callback(null, origin); // echo origin
//     } else {
//       callback(new Error("CORS not allowed"));
//     }
//   },
//   credentials: true,
// }));

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