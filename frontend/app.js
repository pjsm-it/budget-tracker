/**
 * @file app.js
 * @description Frontend logic for Budget Tracker MVP
 */

const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const totalBalance = document.getElementById('total-balance');

const API_URL = 'http://localhost:3000/transactions';

// Global variable to store the transaction being edited
let editingId = null;

/**
 * Fetch and display all transactions
 */
async function loadTransactions() {
  const res = await fetch(API_URL);
  const transactions = await res.json();

  // Clear the transactions list before rendering
  transactionsList.innerHTML = '';

  let balance = 0;

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${t.description} - ${t.category} - $${t.amount} (${t.type})</span>
      <button class="edit" data-id="${t.id}">Edit</button>
      <button class="delete" data-id="${t.id}">Delete</button>
    `;
    transactionsList.appendChild(li);

    // Calculate balance: add for income, subtract for expense
    balance += t.type === 'income' ? t.amount : -t.amount;
  });

  totalBalance.textContent = balance.toFixed(2);
}

/**
 * Handle form submission to add or update a transaction
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const transaction = {
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    type: document.getElementById('type').value,
    category: document.getElementById('category').value
  };

  // If editingId exists, we are updating an existing transaction (PUT)
  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    editingId = null; // Reset editing mode after update
  } else {
    // Otherwise, create a new transaction (POST)
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
  }

  // Reset form fields after submission
  form.reset();
  // Reload transactions to reflect changes
  loadTransactions();
});

/**
 * Handle click events on transaction list
 * - Delete: remove a transaction
 * - Edit: pre-fill form for editing
 */
transactionsList.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('delete')) {
    // Delete transaction via API
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    // Reload transactions to update DOM
    loadTransactions();
  }

  if (e.target.classList.contains('edit')) {
    // Fetch the current transaction to pre-fill the form
    const res = await fetch(`${API_URL}/${id}`);
    const transaction = await res.json();

    // Pre-fill form fields with existing transaction data
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;

    // Set editingId to indicate we are in edit mode
    editingId = id;
  }
});

// Initial load of transactions on page load
loadTransactions();
