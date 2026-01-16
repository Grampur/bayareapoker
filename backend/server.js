const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron')
require('dotenv').config();

const playersRouter = require('./routes/players');
const sessionsRouter = require('./routes/sessions');
const sessionResultsRouter = require('./routes/sessionResults');
const sessionNotesRouter = require('./routes/sessionNotes');
const migrateRoutes = require('./routes/migrate');
const db = require('./database/database');

const app = express();
const PORT = process.env.PORT || 3001;

let cache = {
  profitData: null,
  sessionNotes: null,
  lastUpdated: null
};

async function refreshCache() {
  try {
    console.log('Cache refresh at', new Date().toISOString());
    
    const profitData = await db.query(`
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

    const sessionNotes = await db.query(`
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

    cache = {
      profitData,
      sessionNotes,
      lastUpdated: new Date().toISOString()
    };

    console.log('Cache refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh cache:', error);
  }
}
refreshCache();

cron.schedule('0 8 * * *', () => {
  console.log('Running scheduled cache refresh at midnight PST');
  refreshCache();
});

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/cached/profit-summary', (req, res) => {
  if (!cache.profitData) {
    return res.status(503).json({ 
      error: 'Cache not ready. Please try again in a moment.',
      lastUpdated: cache.lastUpdated 
    });
  }
  
  res.json({
    data: cache.profitData,
    lastUpdated: cache.lastUpdated
  });
});

app.get('/api/cached/session-notes', (req, res) => {
  if (!cache.sessionNotes) {
    return res.status(503).json({ 
      error: 'Cache not ready. Please try again in a moment.',
      lastUpdated: cache.lastUpdated 
    });
  }
  
  res.json({
    data: cache.sessionNotes,
    lastUpdated: cache.lastUpdated
  });
});

app.post('/api/cache/refresh', async (req, res) => {
  try {
    await refreshCache();
    res.json({ 
      message: 'Cache refreshed successfully', 
      lastUpdated: cache.lastUpdated 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh cache' });
  }
});

app.get('/api/cache/status', (req, res) => {
  res.json({
    status: cache.profitData && cache.sessionNotes ? 'ready' : 'not ready',
    lastUpdated: cache.lastUpdated,
    profitDataCount: cache.profitData?.length || 0,
    sessionNotesCount: cache.sessionNotes?.length || 0
  });
});

// Routes
app.use('/api/players', playersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/session-results', sessionResultsRouter);
app.use('/api/session-notes', sessionNotesRouter);
app.use('/api/migrate', migrateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bay Area Poker API is running',
    cacheStatus: cache.profitData && cache.sessionNotes ? 'ready' : 'not ready',
    lastCacheUpdate: cache.lastUpdated
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Cache will refresh at midnight PST');
});