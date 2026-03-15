import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import './dashboard.css';
import { useNavigate, Link } from 'react-router-dom';

// Helper: attach Bearer token to every request
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

function Dashboard2() {
  const [income,          setIncome]          = useState('');
  const [expense,         setExpense]         = useState('');
  const [description,     setDescription]     = useState('');
  const [transactions,    setTransactions]    = useState([]);
  const [budget,          setBudget]          = useState('');
  const [monthlyBudget,   setMonthlyBudget]   = useState(null);
  const [filterDate,      setFilterDate]      = useState('');
  const [category,        setCategory]        = useState('General');
  const [paymentMode,     setPaymentMode]     = useState('Cash');
  const [transactionType, setTransactionType] = useState('');
  const [user,            setUser]            = useState(null);
  const navigate = useNavigate();

  // ─── LOAD TRANSACTIONS ─────────────────────────────────────────────────
  const handleLoadTransactions = useCallback(async (userId, dateFilter) => {
    try {
      let url = `http://localhost:4000/transactions/${userId}`;
      if (dateFilter) url += `?date=${dateFilter}`;

      const response = await fetch(url, { headers: authHeaders() });

      // Token expired or invalid
      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      alert('Failed to load transactions. Is the server running?');
    }
  }, [navigate]);

  // ─── INIT ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!userData) { navigate('/login'); return; }

    setUser(userData);
    if (userData.monthly_budget) {
      setMonthlyBudget(Number(userData.monthly_budget));
      setBudget(String(userData.monthly_budget));
    }
    handleLoadTransactions(userData.id, '');
  }, [navigate, handleLoadTransactions]);

  // ─── LOGOUT ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ─── ADD TRANSACTION ──────────────────────────────────────────────────
  const handleAddTransaction = async () => {
    if (!user) return;

    const amount = transactionType === 'Income' ? income : expense;
    if (!description || !amount || !transactionType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/add-transaction', {
        method:  'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          Type:        transactionType,
          Amount:      amount,
          Description: description,
          Category:    category,
          PaymentMode: paymentMode,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setDescription('');
        setIncome('');
        setExpense('');
        setTransactionType('');
        handleLoadTransactions(user.id, filterDate);
      } else {
        alert(result.message || 'Failed to add transaction');
      }
    } catch {
      alert('Failed to add transaction. Is the server running?');
    }
  };

  // ─── DELETE TRANSACTION ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      const response = await fetch(`http://localhost:4000/transaction/${id}`, {
        method:  'DELETE',
        headers: authHeaders(),
      });
      if (response.ok) {
        handleLoadTransactions(user.id, filterDate);
      }
    } catch {
      alert('Failed to delete');
    }
  };

  // ─── SAVE BUDGET ──────────────────────────────────────────────────────
  const handleSaveBudget = async () => {
    const val = Number(budget);
    if (!val || val <= 0) { alert('Enter a valid budget'); return; }
    try {
      const response = await fetch('http://localhost:4000/budget', {
        method:  'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ monthly_budget: val }),
      });
      const result = await response.json();
      if (response.ok) {
        setMonthlyBudget(val);
        alert('Budget saved!');
      } else {
        alert(result.message);
      }
    } catch {
      alert('Failed to save budget');
    }
  };

  // ─── TOTALS ───────────────────────────────────────────────────────────
  let totalIncome = 0, totalExpense = 0;
  transactions.forEach(t => {
    if (t.type === 'Income') totalIncome  += parseFloat(t.amount);
    else                     totalExpense += parseFloat(t.amount);
  });
  const balance = totalIncome - totalExpense;
  const budgetPct = monthlyBudget ? Math.min((totalExpense / monthlyBudget) * 100, 100) : 0;

  // Avatar initials
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // Category icon map
  const catIcon = { Food:'🍔', Transport:'🚗', Utilities:'💡', Entertainment:'🎬', Shopping:'🛍️', General:'📦' };

  return (
    <div className="dashboard-container">
      {/* ─── HEADER ──────────────────────────────────────────────────── */}
      <div className="dashboard-header">
        <div className="header-logo">Expense<span>.</span>io</div>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-link active">Tracker</Link>
          <Link to="/chart"     className="nav-link">Charts</Link>
        </div>

        <div className="header-right">
          <div className="header-user">
            <div className="header-avatar">{initials}</div>
            <span className="header-username">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2 className="welcome-message">
          Good day, <span>{user?.name?.split(' ')[0]}</span> 👋
        </h2>

        {/* ─── SUMMARY CARDS ──────────────────────────────────────── */}
        <div className="summary-cards">
          {monthlyBudget !== null && (
            <div className="summary-card budget">
              <h3>Monthly Budget</h3>
              <p>₹{monthlyBudget.toLocaleString('en-IN')}</p>
              <div className="budget-progress-bar">
                <div
                  className={`budget-progress-fill${budgetPct > 90 ? ' danger' : budgetPct > 70 ? ' warning' : ''}`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="card-change">{budgetPct.toFixed(0)}% used</div>
            </div>
          )}
          <div className="summary-card income">
            <h3>Total Income</h3>
            <p>₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="summary-card expense">
            <h3>Total Expense</h3>
            <p>₹{totalExpense.toFixed(2)}</p>
          </div>
          <div className={`summary-card ${balance >= 0 ? 'positive' : 'negative'}`}>
            <h3>Balance</h3>
            <p>₹{Math.abs(balance).toFixed(2)}</p>
            <div className="card-change">{balance < 0 ? '⚠ Deficit' : '✓ Surplus'}</div>
          </div>
        </div>

        {/* ─── FILTERS + BUDGET ───────────────────────────────────── */}
        <div className="filters-section">
          <div>
            <label>Filter by date</label>
            <div className="date-filter">
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="filter-input"
              />
              <button
                className="filter-btn"
                onClick={() => handleLoadTransactions(user.id, filterDate)}
              >
                Apply
              </button>
              {filterDate && (
                <button
                  className="filter-btn"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  onClick={() => { setFilterDate(''); handleLoadTransactions(user.id, ''); }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label>Monthly Budget (₹)</label>
            <div className="budget-input">
              <input
                type="number"
                placeholder="e.g. 20000"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="budget-field"
              />
              <button onClick={handleSaveBudget} className="budget-btn">Save</button>
            </div>
          </div>
        </div>

        {/* ─── ADD TRANSACTION ────────────────────────────────────── */}
        <div className="transaction-form">
          <div className="section-header">
            <h3>Add transaction</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="e.g. Grocery shopping"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={transactionType}
                onChange={e => {
                  setTransactionType(e.target.value);
                  if (e.target.value === 'Income') setExpense('');
                  else setIncome('');
                }}
              >
                <option value="">Select type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                value={transactionType === 'Income' ? income : expense}
                onChange={e =>
                  transactionType === 'Income'
                    ? setIncome(e.target.value)
                    : setExpense(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment mode</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Account Transfer">Account Transfer</option>
              </select>
            </div>

            <button onClick={handleAddTransaction} className="submit-btn">
              + Add transaction
            </button>
          </div>
        </div>

        {/* ─── TRANSACTION HISTORY ────────────────────────────────── */}
        <div className="transaction-history">
          <div className="section-header">
            <h3>Transaction history</h3>
            <span className="section-badge">{transactions.length} records</span>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">💸</span>
              <h4>No transactions yet</h4>
              <p>Add your first income or expense above</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className={`transaction-item ${t.type.toLowerCase()}`}
                >
                  <div className="transaction-main">
                    <div className="txn-icon">
                      {catIcon[t.category] || '📦'}
                    </div>
                    <div className="txn-info">
                      <span className="transaction-description">{t.description}</span>
                      <span className="transaction-date">
                        {new Date(t.txn_date || t.Date).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-right">
                    <span className="transaction-amount">
                      {t.type === 'Income' ? '+' : '−'}₹{parseFloat(t.amount).toFixed(2)}
                    </span>
                    <div className="transaction-meta">
                      <span className="transaction-category">{t.category}</span>
                      <span className="transaction-payment">{t.payment_mode || t.PaymentMode}</span>
                    </div>
                  </div>

                  <button
                    className="txn-delete"
                    onClick={() => handleDelete(t.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard2;
