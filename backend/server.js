/**
 * @file server.js
 * @description Express server for Budget Tracker MVP. Handles CRUD operations for transactions.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * @route GET /transactions
 * @description Get all transactions, ordered by creation date descending
 */
app.get('/transactions', (req, res) => {
  const transactions = db.prepare(
    'SELECT * FROM transactions ORDER BY created_at DESC'
  ).all();
  res.json(transactions);
});

/**
 * @route GET /transactions/:id
 * @description Get a single transaction by ID
 */
app.get('/transactions/:id', (req, res) => {
  const transaction = db.prepare(
    'SELECT * FROM transactions WHERE id = ?'
  ).get(req.params.id);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json(transaction);
});

/**
 * @route POST /transactions
 * @description Create a new transaction
 */
app.post('/transactions', (req, res) => {
  const { description, amount, type, category } = req.body;

  if (!description || !amount || !type || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'Type must be income or expense' });
  }

  const result = db.prepare(
    'INSERT INTO transactions (description, amount, type, category) VALUES (?, ?, ?, ?)'
  ).run(description, Math.abs(amount), type, category);

  const transaction = db.prepare(
    'SELECT * FROM transactions WHERE id = ?'
  ).get(result.lastInsertRowid);

  res.status(201).json(transaction);
});

/**
 * @route DELETE /transactions/:id
 * @description Delete a transaction by ID
 */
app.delete('/transactions/:id', (req, res) => {
  const existing = db.prepare(
    'SELECT * FROM transactions WHERE id = ?'
  ).get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
