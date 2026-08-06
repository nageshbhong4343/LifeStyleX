import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Sun,
  Moon,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchPanel from './SearchPanel';
import NotificationsPanel from './NotificationsPanel';
import CreatePostModal from './CreatePostModal';
import './Sidebar.css';

const Sidebar = () => {
  const { user, theme, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleSearchClick = (e) => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
    setNotifsOpen(false);
  };

  const handleNotifsClick = (e) => {
    e.preventDefault();
    setNotifsOpen(!notifsOpen);
    setSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCollapsed = searchOpen || notifsOpen;

  return (
    <>
      <aside className={`instagram-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="logo-link">
            {isCollapsed ? (
              <div className="lifestylex-logo-icon">
                <Sparkles size={24} color="#f09433" />
              </div>
            ) : (
              <h1 className="instagram-logo-text">LifeStyleX</h1>
            )}
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive && !isCollapsed ? 'active' : ''}`}>
            <Home size={24} />
            <span className="nav-label">Home</span>
          </NavLink>

          <button onClick={handleSearchClick} className={`nav-item ${searchOpen ? 'active' : ''}`}>
            <Search size={24} />
            <span className="nav-label">Search</span>
          </button>

          <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive && !isCollapsed ? 'active' : ''}`}>
            <Compass size={24} />
            <span className="nav-label">Explore</span>
          </NavLink>

          <NavLink to="/direct" className={({ isActive }) => `nav-item ${isActive && !isCollapsed ? 'active' : ''}`}>
            <MessageCircle size={24} />
            <span className="nav-label">Messages</span>
          </NavLink>

          <button onClick={handleNotifsClick} className={`nav-item ${notifsOpen ? 'active' : ''}`}>
            <Heart size={24} />
            <span className="nav-label">Notifications</span>
          </button>

          <button onClick={() => setCreateOpen(true)} className="nav-item">
            <PlusSquare size={24} />
            <span className="nav-label">Create</span>
          </button>

          {user && (
            <NavLink to={`/profile/${user.username}`} className={({ isActive }) => `nav-item ${isActive && !isCollapsed ? 'active' : ''}`}>
              <div className="avatar-small-container">
                <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt={user.username} className="avatar-small" />
              </div>
              <span className="nav-label">Profile</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="nav-item">
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            <span className="nav-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {user && (
            <button onClick={handleLogout} className="nav-item logout-btn">
              <LogOut size={24} />
              <span className="nav-label">Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Drawers & Modals */}
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
      {notifsOpen && <NotificationsPanel onClose={() => setNotifsOpen(false)} />}
      {createOpen && <CreatePostModal onClose={() => setCreateOpen(false)} onPostCreated={() => window.location.reload()} />}
    </>
  );
};

export default Sidebar;
