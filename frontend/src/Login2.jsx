import React, { useState } from 'react';
import './App.css';
import { useNavigate, Link } from 'react-router-dom';

function Login2() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', phone: '', email: '', password: '' });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const { name, phone, email, password } = formData;

    try {
      const endpoint = isSignUp ? 'register' : 'login';
      const body     = isSignUp ? { name, phone, email, password } : { email, password };

      const response = await fetch(`https://dailyexpensetracker-production.up.railway.app/${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token + user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user',  JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || (isSignUp ? 'Registration failed' : 'Login failed'));
      }
    } catch {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left decorative panel */}
      <div className="auth-left-panel">
        <div className="auth-panel-logo">Expense<span>.</span>io</div>
        <div className="auth-panel-title">
          Take control of<br />your <span>finances</span>
        </div>
        <p className="auth-panel-sub">
          Track every rupee, set budgets, and get insights — all in one place.
        </p>
        <div className="auth-stats">
          <div className="auth-stat-item">
            <div className="auth-stat-num">₹0</div>
            <div className="auth-stat-label">Wasted</div>
          </div>
          <div className="auth-stat-item">
            <div className="auth-stat-num">100%</div>
            <div className="auth-stat-label">Control</div>
          </div>
          <div className="auth-stat-item">
            <div className="auth-stat-num">∞</div>
            <div className="auth-stat-label">Savings</div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right-panel">
        <Link to="/" className="auth-back-btn">← Back to Home</Link>

        <div className="auth-form-container">
          <div className="auth-header">
            <h2>{isSignUp ? 'Create account' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Register to start tracking' : 'Log in to continue'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <>
                <div className="form-group">
                  <label>Full name</label>
                  <input type="text"  name="name"  placeholder="Your full name"
                    value={formData.name}  onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Phone (optional)</label>
                  <input type="tel"   name="phone" placeholder="+91 98765 43210"
                    value={formData.phone} onChange={handleChange} />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Email address</label>
              <input type="email" name="email"    placeholder="you@example.com"
                value={formData.email}    onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min 6 characters"
                value={formData.password} onChange={handleChange} required minLength={6} />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading
                ? <span className="auth-spinner"></span>
                : (isSignUp ? 'Create account' : 'Login')}
            </button>
          </form>

          <div className="auth-toggle">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={toggleForm} className="auth-toggle-link">
              {isSignUp ? 'Login' : 'Sign up'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login2;
