const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET all players
router.get('/', async (req, res) => {
  try {
    const players = await db.query('SELECT * FROM players ORDER BY name');
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all players profit summary - MOVED BEFORE /:id routes
router.get('/profit-summary/all', async (req, res) => {
  try {
    const summary = await db.query(`
      SELECT 
        p.id,
        p.name,
        COALESCE(SUM(sr.profit), 0) as total_profit,
        COUNT(sr.id) as sessions_played
      FROM players p
      LEFT JOIN session_results sr ON p.id = sr.player_id
      GROUP BY p.id, p.name
      ORDER BY total_profit DESC
    `);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await db.query(
      'SELECT * FROM players WHERE id = ?',
      [req.params.id]
    );

    if (player.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET player profit summary
router.get('/:id/profit-summary', async (req, res) => {
  try {
    const summary = await db.query(`
      SELECT 
        p.id,
        p.name,
        COALESCE(SUM(sr.profit), 0) as total_profit,
        COUNT(sr.id) as sessions_played
      FROM players p
      LEFT JOIN session_results sr ON p.id = sr.player_id
      WHERE p.id = ?
      GROUP BY p.id, p.name
    `, [req.params.id]);

    if (summary.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(summary[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new player
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await db.run(
      'INSERT INTO players (name) VALUES (?)',
      [name]
    );

    const newPlayer = await db.query(
      'SELECT * FROM players WHERE id = ?',
      [result.id]
    );

    res.status(201).json(newPlayer[0]);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Player name already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;