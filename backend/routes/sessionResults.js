const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET all session results
router.get('/', async (req, res) => {
  try {
    const results = await db.query(`
      SELECT 
        sr.*,
        p.name as player_name,
        s.date as session_date,
        s.notes as session_notes
      FROM session_results sr
      JOIN players p ON sr.player_id = p.id
      JOIN sessions s ON sr.session_id = s.id
      ORDER BY s.date DESC, sr.profit DESC
    `);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET session results by session ID
router.get('/session/:sessionId', async (req, res) => {
  try {
    const results = await db.query(`
      SELECT 
        sr.*,
        p.name as player_name
      FROM session_results sr
      JOIN players p ON sr.player_id = p.id
      WHERE sr.session_id = ?
      ORDER BY sr.profit DESC
    `, [req.params.sessionId]);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET session results by player ID
router.get('/player/:playerId', async (req, res) => {
  try {
    const results = await db.query(`
      SELECT 
        sr.*,
        s.date as session_date,
        s.notes as session_notes
      FROM session_results sr
      JOIN sessions s ON sr.session_id = s.id
      WHERE sr.player_id = ?
      ORDER BY s.date DESC
    `, [req.params.playerId]);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new session result
router.post('/', async (req, res) => {
  try {
    const { session_id, player_id, buy_in, cash_out } = req.body;
    
    if (!session_id || !player_id || buy_in === undefined || cash_out === undefined) {
      return res.status(400).json({ 
        error: 'session_id, player_id, buy_in, and cash_out are required' 
      });
    }
    
    const result = await db.run(
      'INSERT INTO session_results (session_id, player_id, buy_in, cash_out) VALUES (?, ?, ?, ?)',
      [session_id, player_id, buy_in, cash_out]
    );
    
    const newResult = await db.query(`
      SELECT 
        sr.*,
        p.name as player_name,
        s.date as session_date
      FROM session_results sr
      JOIN players p ON sr.player_id = p.id
      JOIN sessions s ON sr.session_id = s.id
      WHERE sr.id = ?
    `, [result.id]);
    
    res.status(201).json(newResult[0]);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Player already has a result for this session' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT update session result
router.put('/:id', async (req, res) => {
  try {
    const { buy_in, cash_out } = req.body;
    
    if (buy_in === undefined || cash_out === undefined) {
      return res.status(400).json({ error: 'buy_in and cash_out are required' });
    }
    
    await db.run(
      'UPDATE session_results SET buy_in = ?, cash_out = ? WHERE id = ?',
      [buy_in, cash_out, req.params.id]
    );
    
    const updatedResult = await db.query(`
      SELECT 
        sr.*,
        p.name as player_name,
        s.date as session_date
      FROM session_results sr
      JOIN players p ON sr.player_id = p.id
      JOIN sessions s ON sr.session_id = s.id
      WHERE sr.id = ?
    `, [req.params.id]);
    
    if (updatedResult.length === 0) {
      return res.status(404).json({ error: 'Session result not found' });
    }
    
    res.json(updatedResult[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE session result
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM session_results WHERE id = ?',
      [req.params.id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Session result not found' });
    }
    
    res.json({ message: 'Session result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;