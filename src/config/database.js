const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../services/loggerService');

// Database file path
const dbPath = path.join(__dirname, '../../data/game_club.db');

// Create database connection
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      logger.error('Error opening database', { error: err.message, path: dbPath });
    } else {
      logger.info('Connected to SQLite database', { path: dbPath });
    }
  }
);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create clubs table
      db.run(`
        CREATE TABLE IF NOT EXISTS clubs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          logger.error('Error creating clubs table', { error: err.message });
        } else {
          logger.info('Clubs table created/verified successfully');
        }
      });

      // Create events table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          club_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          event_date DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE
        )
      `,
        (err) => {
          if (err) {
            logger.error('Error creating events table', { error: err.message });
            reject(err);
          } else {
            logger.info('Events table created/verified successfully');
            resolve();
          }
        }
      );
    });
  });
};

module.exports = {
  db,
  initializeDatabase,
};
