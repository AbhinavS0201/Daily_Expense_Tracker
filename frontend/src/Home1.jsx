import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Home1() {
  return (
    <div className="home">
      {/* NAV */}
      <nav className="home-nav">
        <div className="home-logo">Expense<span>.</span>io</div>
        <div className="home-nav-cta">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/login" className="btn-primary">Get started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-badge">✦ Smart Finance Tracking</div>
        <h2>
          Your money,<br />
          <span className="highlight">fully tracked.</span>
        </h2>
        <p>
          Log income and expenses in seconds. Set monthly budgets,
          visualize trends, and make smarter financial decisions — all in one app.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="btn-primary">Start for free →</Link>
          <Link to="/login" className="btn-ghost">See demo</Link>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features">
        <div className="feature">
          <span className="feature-icon">📈</span>
          <h3>Track every rupee</h3>
          <p>Categorize transactions by type, payment mode, and date. Never lose track of where your money went.</p>
        </div>
        <div className="feature">
          <span className="feature-icon">💰</span>
          <h3>Smart budgeting</h3>
          <p>Set monthly budgets and get a real-time progress bar so you always know how much runway you have left.</p>
        </div>
        <div className="feature">
          <span className="feature-icon">📊</span>
          <h3>Visual insights</h3>
          <p>Bar and pie charts break down your spending by category so you can spot patterns and cut waste.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <p>Ready to take control?</p>
        <Link to="/login">
          <button className="register">Create free account</button>
        </Link>
      </div>
    </div>
  );
}

export default Home1;
