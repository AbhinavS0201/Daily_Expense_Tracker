# 💰 Daily Expense Tracker

A full-stack web application to track your daily income and expenses, 
set monthly budgets, and visualize your spending habits with interactive charts.

## 🚀 Features
- 🔐 User authentication with JWT (Register / Login)
- 💸 Add, view, and delete income & expense transactions
- 🏷️ Categorize transactions (Food, Transport, Utilities, etc.)
- 💳 Track payment modes (Cash, UPI, Credit Card, etc.)
- 📊 Interactive charts — Bar, Area, Pie, and Line charts
- 🎯 Set and track monthly budgets with progress bar
- 🌙 Stunning dark luxury UI theme

## 🛠️ Tech Stack
| Frontend | Backend | Database |
|----------|---------|----------|
| React.js | Node.js | MySQL |
| React Router | Express.js | mysql2 |
| Recharts | JWT Auth | |
| CSS3 | bcryptjs | |

## ⚙️ Setup Instructions

### 1. Database
```sql
CREATE DATABASE expense_tracker;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MySQL password in .env
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

App → http://localhost:3000  
API → http://localhost:4000
