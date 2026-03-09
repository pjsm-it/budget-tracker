# Budget Tracker

**Full Stack Web Application (Entry-Level Portfolio Project)**

---

## Project Description

Budget Tracker is a web application to manage personal income and expenses.  
Users can:

- Add transactions (income or expense) with description, amount, and category.
- View all transactions in a list.
- See total balance calculated automatically.
- Edit existing transactions.
- Delete transactions.
- Filter transactions by type or category (optional post-MVP).

The backend is Node.js + Express with SQLite (no ORM), and the frontend is vanilla JavaScript, HTML, and CSS.

---

## Tech Stack

- **Node.js** 20.x LTS
- **Express** 4.18.2
- **better-sqlite3** 9.4.3
- **dotenv** 16.4.1
- **CORS** 2.8.5
- **HTML / CSS / Vanilla JS** for frontend
- **SQLite** database (single `.db` file, no server)

---

## Project Structure
```
budget-tracker/
├── backend/
│ ├── server.js ← Express server and API routes
│ ├── database.js ← SQLite DB initialization
│ ├── package.json ← Dependencies & scripts
│ └── budget.db ← Database file (auto-created)
└── frontend/
├── index.html ← Page structure
├── style.css ← Styles
└── app.js ← Frontend logic
````

---

## Installation & Setup

1. Clone the repository:

git clone <repository-url>
cd budget-tracker/backend

2. Install dependencies:
npm install

3. Start the backend server:
npm start

4. Open frontend/index.html in your browser (double click or via Live Server).

---

## Reset Database

To start with a clean database:
cd backend
npm run reset-db
npm start

This deletes the current budget.db and creates a new empty database when the server starts.

---

## API Endpoints (MVP)

API Endpoints (MVP)
Method  Route               Description
GET	    /transactions	    List all transactions
GET	    /transactions/:id	Get a transaction by ID
POST	/transactions	    Create a new transaction
PUT	    /transactions/:id	Update an existing transaction
DELETE	/transactions/:id	Delete a transaction

---

## Author
Paulo Melo
