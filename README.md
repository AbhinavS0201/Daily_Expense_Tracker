# 💰 Daily Expense Tracker

A full-stack personal finance management application that helps users track income, monitor expenses, manage budgets, and visualize spending patterns through an interactive dashboard.

Built with a modern client-server architecture using React, Node.js, Express, MySQL, and real-time financial analytics.

---

## 🌐 Live Demo

**Frontend:** https://daily-expense-tracker-beta.vercel.app/

---

## 🚀 Overview

Daily Expense Tracker is a web-based financial management platform designed to simplify personal budgeting and expense monitoring.

The application allows users to securely manage financial transactions, track spending habits, maintain budget goals, and gain insights through visual analytics.

It provides a centralized dashboard where users can monitor their complete financial activity in real time.

---

## ✨ Key Features

### 🔐 Secure Authentication

* User Registration & Login
* Protected Dashboard Access
* Session-Based Authentication
* Secure Credential Management

### 💸 Expense Management

* Add Income & Expense Transactions
* Categorized Financial Records
* Transaction History Tracking
* Real-Time Balance Updates

### 📊 Financial Analytics

* Income vs Expense Visualization
* Spending Insights
* Budget Monitoring
* Interactive Charts & Graphs

### 🎯 Budget Planning

* Monthly Budget Setup
* Budget Utilization Tracking
* Remaining Balance Calculation
* Financial Goal Monitoring

### 📱 Responsive User Interface

* Mobile-Friendly Design
* Modern Dashboard Layout
* Clean User Experience
* Fast Navigation

---

## 🏗 System Architecture

```text
Frontend (React.js)
          │
          ▼
REST API (Express.js)
          │
          ▼
Business Logic Layer
          │
          ▼
MySQL Database
```

---

## 🛠 Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* CSS3
* Axios
* React Hooks

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MySQL

### Tools & Deployment

* Git & GitHub
* Vercel
* Render
* MySQL Workbench

---

## 📂 Project Structure

```text
Daily_Expense_Tracker
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── database
│   └── middleware
│
└── README.md
```

---

## 🔑 Core Functionalities

### User Management

* Account Creation
* Login Authentication
* User-Specific Financial Data

### Transaction Management

* Add Transactions
* Delete Transactions
* View Transaction History
* Categorize Spending

### Financial Dashboard

* Current Balance Overview
* Total Income Calculation
* Total Expense Calculation
* Budget Status Tracking

### Data Persistence

* Secure MySQL Storage
* User-Based Data Retrieval
* Persistent Financial Records

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/AbhinavS0201/Daily_Expense_Tracker.git

cd Daily_Expense_Tracker
```

---

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker

PORT=5000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 📈 Future Enhancements

* Export Reports (PDF/CSV)
* Expense Categorization using AI
* Multi-Currency Support
* Recurring Expense Tracking
* Email Notifications
* Cloud Database Integration
* Advanced Financial Analytics
* Dark Mode Support

---

## 👨‍💻 Author

**Abhinav Rama**

GitHub: https://github.com/AbhinavS0201

---

## 📄 License

This project is licensed under the MIT License.
