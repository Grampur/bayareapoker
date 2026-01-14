const db = require('../database/database');

async function seed() {
  try {
    console.log('Seeding database with sample data...');

    // Insert sample players
    const players = [
      'Gagan R.',
      'Sean S.',
      'Troy H.',
      'Ethan T.',
      'Avery T.',
      'Ethan L.'
    ];

    for (const player of players) {
      await db.run(
        'INSERT OR IGNORE INTO players (name) VALUES (?)',
        [player]
      );
    }

    // Insert sample sessions
    const sessions = [
      { date: '2024-01-15', notes: 'Regular home game' },
      { date: '2024-01-22', notes: 'Tournament style' }
    ];

    for (const session of sessions) {
      await db.run(
        'INSERT INTO sessions (date, notes) VALUES (?, ?)',
        [session.date, session.notes]
      );
    }

    // Insert sample session results (based on your current hardcoded data)
    const results = [
      { sessionId: 1, playerName: 'Gagan R.', buyIn: 100, cashOut: 131 },
      { sessionId: 1, playerName: 'Sean S.', buyIn: 100, cashOut: 134 },
      { sessionId: 1, playerName: 'Troy H.', buyIn: 100, cashOut: 180 },
      { sessionId: 1, playerName: 'Ethan T.', buyIn: 100, cashOut: 55 },
      { sessionId: 1, playerName: 'Avery T.', buyIn: 100, cashOut: 67 },
      { sessionId: 1, playerName: 'Ethan L.', buyIn: 100, cashOut: 33 },
      
      { sessionId: 2, playerName: 'Gagan R.', buyIn: 100, cashOut: 130 },
      { sessionId: 2, playerName: 'Sean S.', buyIn: 100, cashOut: 134 },
      { sessionId: 2, playerName: 'Ethan T.', buyIn: 100, cashOut: 54 },
      { sessionId: 2, playerName: 'Avery T.', buyIn: 100, cashOut: 33 },
      { sessionId: 2, playerName: 'Ethan L.', buyIn: 100, cashOut: 81 }
    ];

    for (const result of results) {
      // Get player ID
      const player = await db.query(
        'SELECT id FROM players WHERE name = ?',
        [result.playerName]
      );
      
      if (player.length > 0) {
        await db.run(
          'INSERT INTO session_results (session_id, player_id, buy_in, cash_out) VALUES (?, ?, ?, ?)',
          [result.sessionId, player[0].id, result.buyIn, result.cashOut]
        );
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

seed();