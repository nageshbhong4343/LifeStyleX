import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [username, setUsername] = useState('demo_user');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username || 'demo_user', password || 'password123');
      navigate('/');
    } catch (err) {
      console.warn('Navigating with demo session');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    try {
      await login('demo_user', 'password123');
      navigate('/');
    } catch (err) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Mock Phone Container */}
      <div className="phone-preview-container">
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
          alt="LifeStyleX Showcase"
          className="phone-screen-img"
        />
      </div>

      <div className="auth-form-column">
        <div className="auth-card">
          <h1 className="instagram-logo-text auth-logo">LifeStyleX</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <input
              type="text"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="line"></div>
            <span>OR</span>
            <div className="line"></div>
          </div>

          <button onClick={handleQuickDemoLogin} className="btn-secondary quick-demo-btn">
            🚀 Instant Demo Login
          </button>
        </div>

        <div className="auth-card auth-switch-card">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
