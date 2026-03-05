/**
 * @file app.js
 * @description Frontend logic for Budget Tracker MVP
 */

const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const totalBalance = document.getElementById('total-balance');

const API_URL = 'http://localhost:3000/transactions';

/**
 * Fetch and display all transactions
 */
async function loadTransactions() {
  const res = await fetch(API_URL);
  const transactions = await res.json();

  transactionsList.innerHTML = '';

  let balance = 0;

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${t.description} - ${t.category} - $${t.amount} (${t.type})</span>
      <button class="delete" data-id="${t.id}">Delete</button>
    `;
    transactionsList.appendChild(li);

    balance += t.type === 'income' ? t.amount : -t.amount;
  });

  totalBalance.textContent = balance.toFixed(2);
}

/**
 * Handle form submission to add a transaction
 */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const transaction = {
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    type: document.getElementById('type').value,
    category: document.getElementById('category').value
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });

  form.reset();
  loadTransactions();
});

/**
 * Handle delete transaction
 */
transactionsList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete')) {
    const id = e.target.dataset.id;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTransactions();
  }
});

// Initial load
loadTransactions();
