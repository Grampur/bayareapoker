const db = require('../database/database');

async function migrate() {
  try {
    console.log('Creating database tables');

    // Create players table
    await db.run(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create session_results table
    await db.run(`
      CREATE TABLE IF NOT EXISTS session_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        buy_in DECIMAL(10, 2) NOT NULL,
        cash_out DECIMAL(10, 2) NOT NULL,
        profit DECIMAL(10, 2) GENERATED ALWAYS AS (cash_out - buy_in) STORED,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        UNIQUE(session_id, player_id)
      )
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();