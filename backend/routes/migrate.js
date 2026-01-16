const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', async (req, res) => {
  try {
    console.log('Creating database tables');

    // Create players table
    await db.run(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create session_results table
    await db.run(`
      CREATE TABLE IF NOT EXISTS session_results (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        buy_in DECIMAL(10, 2) NOT NULL,
        cash_out DECIMAL(10, 2) NOT NULL,
        profit DECIMAL(10, 2) GENERATED ALWAYS AS (cash_out - buy_in) STORED,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        UNIQUE(session_id, player_id)
      )
    `);

    res.json({ message: 'Database tables created successfully!' });
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;