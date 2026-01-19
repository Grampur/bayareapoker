const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await db.query(`
      SELECT 
        s.*,
        COUNT(sr.id) as player_count,
        SUM(sr.buy_in) as total_buy_ins,
        SUM(sr.cash_out) as total_cash_outs
      FROM sessions s
      LEFT JOIN session_results sr ON s.id = sr.session_id
      GROUP BY s.id
      ORDER BY s.date DESC
    `);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET session by ID with results
router.get('/:id', async (req, res) => {
  try {
    const session = await db.query(
      'SELECT * FROM sessions WHERE id = ?',
      [req.params.id]
    );

    if (session.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const results = await db.query(`
      SELECT 
        sr.*,
        p.name as player_name
      FROM session_results sr
      JOIN players p ON sr.player_id = p.id
      WHERE sr.session_id = ?
      ORDER BY sr.profit DESC
    `, [req.params.id]);

    res.json({
      ...session[0],
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new session
router.post('/', async (req, res) => {
  try {
    const { date, notes } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const result = await db.run(
      'INSERT INTO sessions (date, notes) VALUES (?, ?)',
      [date, notes || null]
    );

    const newSession = await db.query(
      'SELECT * FROM sessions WHERE id = ?',
      [result.id]
    );

    req.app.get('invalidateCache')();

    res.status(201).json(newSession[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update session
router.put('/:id', async (req, res) => {
  try {
    const { date, notes } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    await db.run(
      'UPDATE sessions SET date = ?, notes = ? WHERE id = ?',
      [date, notes || null, req.params.id]
    );

    const updatedSession = await db.query(
      'SELECT * FROM sessions WHERE id = ?',
      [req.params.id]
    );

    if (updatedSession.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    req.app.get('invalidateCache')();

    res.json(updatedSession[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;