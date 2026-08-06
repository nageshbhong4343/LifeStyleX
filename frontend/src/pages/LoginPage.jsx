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
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
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
          alt="Instagram App Showcase"
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

          <div className="demo-hint">
            <p><strong>Quick Login Credentials:</strong></p>
            <p>Username: <code>demo_user</code></p>
            <p>Password: <code>password123</code></p>
          </div>
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
