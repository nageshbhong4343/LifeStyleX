import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StoryBar from '../components/StoryBar';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedData = async () => {
    try {
      const postsRes = await API.get('/posts/feed');
      setPosts(postsRes.data);

      const suggestedRes = await API.get('/users/suggested');
      setSuggestedUsers(suggestedRes.data);
    } catch (err) {
      console.error('Error fetching home feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, []);

  const handleFollowUser = async (targetId) => {
    try {
      await API.post(`/users/${targetId}/follow`);
      setSuggestedUsers((prev) => prev.filter((u) => u.id !== targetId));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  return (
    <div className="home-layout">
      {/* Feed Column */}
      <div className="feed-column">
        <StoryBar />

        {loading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={fetchFeedData} />
          ))
        ) : (
          <div className="empty-feed">
            <h3>Welcome to LifeStyleX!</h3>
            <p>Follow users or share your first post to populate your feed.</p>
          </div>
        )}
      </div>

      {/* Right Suggestions Column */}
      <aside className="suggestions-column">
        {user && (
          <div className="current-user-row">
            <Link to={`/profile/${user.username}`} className="user-info">
              <img src={user.avatar} alt={user.username} className="user-avatar" />
              <div className="user-details">
                <span className="username">{user.username}</span>
                <span className="fullname">{user.full_name || 'LifeStyleX User'}</span>
              </div>
            </Link>
            <button className="switch-btn" onClick={() => alert('Demo account active')}>
              Switch
            </button>
          </div>
        )}

        <div className="suggestions-header">
          <span>Suggested for you</span>
          <Link to="/explore" className="see-all">See All</Link>
        </div>

        <div className="suggested-users-list">
          {suggestedUsers.map((su) => (
            <div key={su.id} className="suggested-user-item">
              <Link to={`/profile/${su.username}`} className="user-info">
                <img src={su.avatar} alt={su.username} className="user-avatar" />
                <div className="user-details">
                  <span className="username">{su.username}</span>
                  <span className="fullname">Suggested for you</span>
                </div>
              </Link>
              <button onClick={() => handleFollowUser(su.id)} className="follow-btn">
                Follow
              </button>
            </div>
          ))}
        </div>

        <footer className="footer-links">
          <p>© 2026 LIFESTYLEX</p>
        </footer>
      </aside>
    </div>
  );
};

export default HomePage;
