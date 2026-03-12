/**
 * @file app.js
 * @description Frontend logic for Budget Tracker MVP with Edit/Cancel enhancements and delete confirmation
 */

const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const totalBalance = document.getElementById('total-balance');

// const API_URL = 'http://localhost:3000/transactions';
const API_URL = 'https://budget-tracker-api-2xib.onrender.com/transactions';

// Global variable to store the transaction being edited
let editingId = null;

// Reference to the form submit button
const submitButton = form.querySelector('button[type="submit"]');
// Dynamic cancel button
let cancelButton = null;

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
 * Reset form and editing state
 */
function resetForm() {
  form.reset();
  editingId = null;
  submitButton.textContent = 'Add';
  if (cancelButton) {
    cancelButton.remove();
    cancelButton = null;
  }
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

  if (editingId) {
    // Update existing transaction
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
  } else {
    // Create new transaction
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
  }

  // Reset form and reload transactions
  resetForm();
  loadTransactions();
});

/**
 * Handle click events on transaction list
 */
transactionsList.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('delete')) {
    /**
     * @description Confirm before deleting a transaction
     * @example if (confirm("Are you sure?")) { ... }
     */
    if (confirm('Are you sure you want to delete this transaction?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadTransactions();
    }
  }

  if (e.target.classList.contains('edit')) {
    const res = await fetch(`${API_URL}/${id}`);
    const transaction = await res.json();

    // Pre-fill form fields
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;

    // Set editing state
    editingId = id;
    submitButton.textContent = 'Save';

    // Create Cancel button dynamically if it doesn't exist
    if (!cancelButton) {
      cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'Cancel';
      form.appendChild(cancelButton);
      cancelButton.addEventListener('click', resetForm);
    }
  }
});

// Initial load of transactions on page load
loadTransactions();
