/**
 * @file database.js
 * @description Initializes the SQLite database and creates the 'transactions' table if it doesn't exist.
 */

const Database = require('better-sqlite3');
const path = require('path');

// Path to the SQLite database file
const dbPath = path.resolve(__dirname, 'budget.db');

// Initialize the database
const db = new Database(dbPath);

/**
 * Create the transactions table if it doesn't exist.
 * Columns:
 * - id: primary key, auto-increment
 * - description: text, not null
 * - amount: real, not null
 * - type: text, 'income' or 'expense'
 * - category: text, not null
 * - created_at: datetime, default current timestamp
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
