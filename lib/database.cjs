// Database utility for persistent token storage using SQLite
const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const DB_PATH = process.env.DB_FILE || path.join(process.cwd(), 'downloads.db');

let db;
try {
  db = new Database(DB_PATH);
  console.log('Database initialized at:', DB_PATH);
} catch (error) {
  console.error('Failed to initialize database:', error);
  throw error;
}

// Create tables if they don't exist
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      email TEXT NOT NULL,
      token TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      downloads_remaining INTEGER NOT NULL DEFAULT 3,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
      last_download_at INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_tokens_email ON tokens(email);
    CREATE INDEX IF NOT EXISTS idx_tokens_expires_at ON tokens(expires_at);
  `);
  console.log('Database tables created successfully');
} catch (error) {
  console.error('Failed to create database tables:', error);
  throw error;
}

// Prepared statements for performance
let statements;
try {
  statements = {
    insertToken: db.prepare(`
      INSERT INTO tokens (email, token, expires_at, downloads_remaining)
      VALUES (?, ?, ?, ?)
    `),

    getToken: db.prepare(`
      SELECT * FROM tokens WHERE token = ?
    `),

    decrementDownloads: db.prepare(`
      UPDATE tokens
      SET downloads_remaining = downloads_remaining - 1,
          last_download_at = ?
      WHERE token = ? AND downloads_remaining > 0
    `),

    getTokenCount: db.prepare(`
      SELECT COUNT(*) as count FROM tokens WHERE email = ?
    `),

    cleanupExpired: db.prepare(`
      DELETE FROM tokens WHERE expires_at < ?
    `),

    getStats: db.prepare(`
      SELECT
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN downloads_remaining > 0 AND expires_at > ? THEN 1 END) as active_tokens,
        SUM(CASE WHEN downloads_remaining < 3 THEN 1 ELSE 0 END) as used_tokens
      FROM tokens
    `)
  };
  console.log('Database prepared statements created successfully');
} catch (error) {
  console.error('Failed to create prepared statements:', error);
  throw error;
}

// Database operations
let tokenDB;
try {
  tokenDB = {
    // Store a new token
    storeToken(email, token, expiresAt, downloadsRemaining = 3) {
      try {
        statements.insertToken.run(email, token, expiresAt, downloadsRemaining);
        return true;
      } catch (error) {
        console.error('Error storing token:', error);
        return false;
      }
    },

    // Get token data
    getToken(token) {
      try {
        return statements.getToken.get(token);
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    },

    // Validate and decrement download count
    validateAndDecrement(token) {
      try {
        const result = statements.decrementDownloads.run(Date.now(), token);
        return result.changes > 0; // Returns true if a row was updated
      } catch (error) {
        console.error('Error decrementing downloads:', error);
        return false;
      }
    },

    // Check if token is valid (exists, not expired, has downloads remaining)
    isValidToken(token) {
      const record = this.getToken(token);
      if (!record) return false;

      const now = Date.now();
      return record.expires_at > now && record.downloads_remaining > 0;
    },

    // Get token status for validation endpoint
    getTokenStatus(token) {
      const record = this.getToken(token);
      if (!record) return 'invalid';

      const now = Date.now();
      if (record.expires_at <= now) return 'expired';
      if (record.downloads_remaining <= 0) return 'limit_reached';

      return 'valid';
    },

    // Clean up expired tokens (call periodically)
    cleanupExpired() {
      try {
        const now = Date.now();
        const result = statements.cleanupExpired.run(now);
        return result.changes;
      } catch (error) {
        console.error('Error cleaning up expired tokens:', error);
        return 0;
      }
    },

    // Get database statistics
    getStats() {
      try {
        const now = Date.now();
        return statements.getStats.get(now);
      } catch (error) {
        console.error('Error getting stats:', error);
        return null;
      }
    },

    // Close database connection (call on server shutdown)
    close() {
      db.close();
    }
  };
  console.log('Database tokenDB object created successfully');
} catch (error) {
  console.error('Failed to create tokenDB object:', error);
  throw error;
}

// Export the database interface
module.exports = { tokenDB };