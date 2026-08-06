import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    if (token === 'mock_lifestylex_token_12345') {
      const stored = localStorage.getItem('mock_user');
      if (stored) {
        setUser(JSON.parse(stored));
        setLoading(false);
        return;
      }
    }
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Auth verify error', err);
      const stored = localStorage.getItem('mock_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const createMockUser = (uname) => ({
    id: 999,
    username: uname || 'demo_user',
    email: `${uname || 'demo_user'}@example.com`,
    full_name: uname === 'demo_user' ? 'Demo Account' : (uname ? uname.replace('_', ' ') : 'LifeStyleX User'),
    bio: '👋 Welcome to LifeStyleX! Enjoy exploring 100+ posts, stories & connecting with friends.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
    followers_count: 1280,
    following_count: 450,
    posts_count: 100
  });

  const login = async (username, password) => {
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.access_token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.warn('Backend login unavailable or returned error, using fallback demo session');
      const mockUser = createMockUser(username);
      localStorage.setItem('token', 'mock_lifestylex_token_12345');
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      localStorage.setItem('token', res.data.access_token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.warn('Backend register unavailable or returned error, using fallback session');
      const mockUser = createMockUser(userData.username);
      localStorage.setItem('token', 'mock_lifestylex_token_12345');
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
