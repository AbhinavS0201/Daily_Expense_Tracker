# Daily Expense Tracker — Setup Guide

## Project Structure
```
expense-tracker/
├── frontend/src/         React app (your existing project)
│   ├── App.css           ← NEW stunning dark CSS
│   ├── dashboard.css     ← NEW dashboard extras
│   ├── Home1.jsx         ← updated
│   ├── Login2.jsx        ← updated (JWT auth)
│   └── Dashboard2.jsx    ← updated (JWT, delete, avatar)
│
└── backend/
    ├── server.js         ← Express + MySQL API
    ├── package.json
    └── .env.example
```

---

## 1 — MySQL Database Setup

Open MySQL Workbench (or CLI) and run:

```sql
CREATE DATABASE IF NOT EXISTS expense_tracker
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

That's it — all tables are **auto-created** when the server starts.

---

## 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and edit the env file
cp .env.example .env
# Open .env and fill in DB_USER, DB_PASSWORD, JWT_SECRET

# Start the server
npm run dev       # with auto-restart (nodemon)
# or
npm start         # production
```

Server runs at **http://localhost:4000**

---

## 3 — Frontend Setup

Copy the 5 files from `frontend/src/` into your React project's `src/` folder,
replacing the old versions.

Make sure your `App.js` imports are:
```js
import Login2     from './Login2';
import Home1      from './Home1';
import Dashboard2 from './Dashboard2';
// Charts is your existing component — no changes needed
```

Then start the React dev server:
```bash
npm start
```

---

## API Reference

| Method | Endpoint                    | Auth? | Description                      |
|--------|-----------------------------|-------|----------------------------------|
| POST   | /register                   | No    | Create account                   |
| POST   | /login                      | No    | Login, returns JWT token         |
| GET    | /me                         | Yes   | Get own profile                  |
| PUT    | /budget                     | Yes   | Update monthly budget            |
| POST   | /add-transaction            | Yes   | Add income or expense            |
| GET    | /transactions/:userId       | Yes   | List transactions (filterable)   |
| DELETE | /transaction/:id            | Yes   | Delete a transaction             |
| GET    | /summary/:userId            | Yes   | Totals + category breakdown      |

**Filter params for GET /transactions/:userId:**
- `?date=YYYY-MM-DD`     — exact date
- `?month=6&year=2025`   — full month
- `?category=Food`       — category filter
- `?type=Expense`        — Income or Expense

**All protected routes** require the header:
```
Authorization: Bearer <token>
```
The token is stored in `localStorage.getItem('token')` after login.

---

## Features Added vs Original Code

| Feature                | Original | New     |
|------------------------|----------|---------|
| MySQL persistence      | ✗        | ✅      |
| JWT authentication     | ✗        | ✅      |
| Password hashing       | ✗        | ✅ bcrypt |
| Budget saved to DB     | ✗        | ✅      |
| Delete transactions    | ✗        | ✅      |
| Analytics endpoint     | ✗        | ✅ /summary |
| 401 auto-redirect      | ✗        | ✅      |
| Stunning dark CSS      | Basic    | ✅      |
