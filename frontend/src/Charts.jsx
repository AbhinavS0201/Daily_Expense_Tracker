import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import './Charts.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const COLORS = ['#c8f542', '#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'];
const CATEGORY_COLORS = {
  Food:          '#f87171',
  Transport:     '#60a5fa',
  Utilities:     '#fbbf24',
  Entertainment: '#a78bfa',
  Shopping:      '#fb923c',
  General:       '#c8f542',
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: ₹{parseFloat(p.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
        <p>₹{parseFloat(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <p style={{ color: 'var(--text-muted)' }}>{payload[0].payload.percent}%</p>
      </div>
    );
  }
  return null;
};

function Charts() {
  const [summary,      setSummary]      = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [user,         setUser]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const navigate = useNavigate();

  const loadData = useCallback(async (userData) => {
    try {
      setLoading(true);

      // Load summary (totals + category breakdown + monthly trend)
      const [summaryRes, txnRes] = await Promise.all([
        fetch(`https://dailyexpensetracker-production.up.railway.app/summary/${userData.id}`, { headers: authHeaders() }),
        fetch(`https://dailyexpensetracker-production.up.railway.app/transactions/${userData.id}`, { headers: authHeaders() }),
      ]);

      if (summaryRes.status === 401 || txnRes.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const summaryData = await summaryRes.json();
      const txnData     = await txnRes.json();

      setSummary(summaryData);
      setTransactions(Array.isArray(txnData) ? txnData : []);
    } catch {
      console.error('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!userData) { navigate('/login'); return; }
    setUser(userData);
    loadData(userData);
  }, [navigate, loadData]);

  // ── Derived data ──────────────────────────────────────────────────────────

  // Category pie data
  const pieData = (summary?.byCategory || []).map((item, i) => {
    const total = summary?.totals?.total_expense || 1;
    return {
      name:    item.category,
      value:   parseFloat(item.total),
      fill:    CATEGORY_COLORS[item.category] || COLORS[i % COLORS.length],
      percent: ((parseFloat(item.total) / total) * 100).toFixed(1),
    };
  });

  // Monthly trend bar data
  const monthlyData = (summary?.monthly || []).map(m => ({
    month:   m.month_label,
    Income:  parseFloat(m.income  || 0),
    Expense: parseFloat(m.expense || 0),
    Savings: parseFloat(m.income  || 0) - parseFloat(m.expense || 0),
  }));

  // Payment mode breakdown
  const paymentMap = {};
  transactions.filter(t => t.type === 'Expense').forEach(t => {
    const mode = t.payment_mode || 'Cash';
    paymentMap[mode] = (paymentMap[mode] || 0) + parseFloat(t.amount);
  });
  const paymentData = Object.entries(paymentMap).map(([name, value], i) => ({
    name, value,
    fill: COLORS[i % COLORS.length],
    percent: ((value / (summary?.totals?.total_expense || 1)) * 100).toFixed(1),
  }));

  // Daily spending (last 14 days)
  const dailyMap = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyMap[key] = { date: key.slice(5), amount: 0 };
  }
  transactions.filter(t => t.type === 'Expense').forEach(t => {
    const key = (t.txn_date || '').slice(0, 10);
    if (dailyMap[key]) dailyMap[key].amount += parseFloat(t.amount);
  });
  const dailyData = Object.values(dailyMap);

  const totalIncome  = parseFloat(summary?.totals?.total_income  || 0);
  const totalExpense = parseFloat(summary?.totals?.total_expense || 0);
  const savingsRate  = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="charts-loading">
          <div className="loading-spinner"></div>
          <p>Loading charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* ─── HEADER ──────────────────────────────────────────────────── */}
      <div className="dashboard-header">
        <div className="header-logo">Expense<span>.</span>io</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Tracker</Link>
          <Link to="/chart"     className="nav-link active">Charts</Link>
        </div>
        <div className="header-right">
          <div className="header-user">
            <div className="header-avatar">{initials}</div>
            <span className="header-username">{user?.name}</span>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2 className="welcome-message">Financial <span>Overview</span></h2>

        {/* ─── KPI CARDS ──────────────────────────────────────────── */}
        <div className="summary-cards">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <p>₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="summary-card expense">
            <h3>Total Expense</h3>
            <p>₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className={`summary-card ${totalIncome - totalExpense >= 0 ? 'positive' : 'negative'}`}>
            <h3>Net Savings</h3>
            <p>₹{Math.abs(totalIncome - totalExpense).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="summary-card budget">
            <h3>Savings Rate</h3>
            <p>{savingsRate}%</p>
            <div className="card-change">{savingsRate > 20 ? '✓ Healthy' : '⚠ Low'}</div>
          </div>
        </div>

        {/* ─── ROW 1: Monthly Trend + Daily Spending ──────────────── */}
        <div className="charts-row">
          {/* Monthly Income vs Expense */}
          <div className="chart-card chart-card-wide">
            <div className="chart-card-header">
              <h3>Monthly trend</h3>
              <span className="chart-badge">Last 6 months</span>
            </div>
            {monthlyData.length === 0 ? (
              <div className="chart-empty">No monthly data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#8b91a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8b91a8', fontSize: 12 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend wrapperStyle={{ color: '#8b91a8', fontSize: 13 }} />
                  <Bar dataKey="Income"  fill="#4ade80" radius={[4,4,0,0]} />
                  <Bar dataKey="Expense" fill="#f87171" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Daily Spending Area */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Daily spending</h3>
              <span className="chart-badge">Last 14 days</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#8b91a8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8b91a8', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="amount" name="Expense"
                  stroke="#f87171" strokeWidth={2} fill="url(#spendGrad)" dot={{ fill: '#f87171', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── ROW 2: Category Pie + Payment Mode Pie ─────────────── */}
        <div className="charts-row">
          {/* Expense by Category */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Expense by category</h3>
              <span className="chart-badge">{pieData.length} categories</span>
            </div>
            {pieData.length === 0 ? (
              <div className="chart-empty">No expense data yet</div>
            ) : (
              <div className="pie-layout">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                      paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {pieData.map((item, i) => (
                    <div key={i} className="pie-legend-item">
                      <span className="pie-dot" style={{ background: item.fill }}></span>
                      <span className="pie-name">{item.name}</span>
                      <span className="pie-pct">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Mode Breakdown */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Payment methods</h3>
              <span className="chart-badge">By expense</span>
            </div>
            {paymentData.length === 0 ? (
              <div className="chart-empty">No payment data yet</div>
            ) : (
              <div className="pie-layout">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                      paddingAngle={3} dataKey="value">
                      {paymentData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {paymentData.map((item, i) => (
                    <div key={i} className="pie-legend-item">
                      <span className="pie-dot" style={{ background: item.fill }}></span>
                      <span className="pie-name">{item.name}</span>
                      <span className="pie-pct">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── ROW 3: Savings Line Chart ───────────────────────────── */}
        {monthlyData.length > 0 && (
          <div className="chart-card chart-card-full">
            <div className="chart-card-header">
              <h3>Savings trend</h3>
              <span className="chart-badge">Monthly net</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c8f542" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c8f542" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#8b91a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8b91a8', fontSize: 12 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Savings" name="Net Savings"
                  stroke="#c8f542" strokeWidth={2.5}
                  dot={{ fill: '#c8f542', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#c8f542' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ─── TOP EXPENSES TABLE ──────────────────────────────────── */}
        <div className="chart-card chart-card-full">
          <div className="chart-card-header">
            <h3>Top expenses</h3>
            <span className="chart-badge">Highest 5</span>
          </div>
          {transactions.filter(t => t.type === 'Expense').length === 0 ? (
            <div className="chart-empty">No expenses recorded yet</div>
          ) : (
            <div className="top-expenses">
              {transactions
                .filter(t => t.type === 'Expense')
                .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
                .slice(0, 5)
                .map((t, i) => {
                  const pct = ((parseFloat(t.amount) / totalExpense) * 100).toFixed(1);
                  return (
                    <div key={i} className="top-expense-item">
                      <div className="top-expense-rank">#{i + 1}</div>
                      <div className="top-expense-info">
                        <span className="top-expense-desc">{t.description}</span>
                        <div className="top-expense-bar-wrap">
                          <div className="top-expense-bar"
                            style={{ width: `${pct}%`, background: CATEGORY_COLORS[t.category] || '#c8f542' }} />
                        </div>
                      </div>
                      <div className="top-expense-meta">
                        <span className="top-expense-cat"
                          style={{ color: CATEGORY_COLORS[t.category] || '#c8f542' }}>
                          {t.category}
                        </span>
                        <span className="top-expense-amount">
                          ₹{parseFloat(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Charts;
