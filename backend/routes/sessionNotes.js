const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET all session notes for a specific session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const notes = await db.query(`
      SELECT 
        sn.*,
        s.date as session_date,
        s.notes as session_notes
      FROM session_notes sn
      JOIN sessions s ON sn.session_id = s.id
      WHERE sn.session_id = $1
      ORDER BY sn.created_at ASC
    `, [req.params.sessionId]);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all session notes grouped by session
router.get('/all', async (req, res) => {
  try {
    const notes = await db.query(`
      SELECT 
        s.id as session_id,
        s.date as session_date,
        s.notes as session_notes,
        json_agg(
          json_build_object(
            'id', sn.id,
            'note_text', sn.note_text,
            'created_at', sn.created_at
          ) ORDER BY sn.created_at ASC
        ) FILTER (WHERE sn.id IS NOT NULL) as notable_hands
      FROM sessions s
      LEFT JOIN session_notes sn ON s.id = sn.session_id
      GROUP BY s.id, s.date, s.notes
      ORDER BY s.date DESC
    `);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new session note
router.post('/', async (req, res) => {
  try {
    const { session_id, note_text } = req.body;

    if (!session_id || !note_text) {
      return res.status(400).json({ error: 'Session ID and note text are required' });
    }

    const result = await db.run(
      'INSERT INTO session_notes (session_id, note_text) VALUES ($1, $2) RETURNING *',
      [session_id, note_text]
    );

    req.app.get('invalidateCache')();

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update session note
router.put('/:id', async (req, res) => {
  try {
    const { note_text } = req.body;

    if (!note_text) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const result = await db.run(
      'UPDATE session_notes SET note_text = $1 WHERE id = $2 RETURNING *',
      [note_text, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Session note not found' });
    }

    req.app.get('invalidateCache')();

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE session note
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM session_notes WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Session note not found' });
    }

    req.app.get('invalidateCache')();

    res.json({ message: 'Session note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;