# Daily Expense Tracker

Full-stack expense tracking app built with React, Node.js, Express, and MySQL.

## Setup

### 1. Database
Open MySQL and run:
```sql
CREATE DATABASE expense_tracker;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL password
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

App runs at http://localhost:3000
API runs at http://localhost:4000