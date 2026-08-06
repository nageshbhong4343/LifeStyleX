import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import API from '../services/api';
import './NotificationsPanel.css';

const NotificationsPanel = ({ onClose }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await API.get('/notifications/');
      setNotifs(res.data);
      // Mark read
      await API.post('/notifications/read');
    } catch (err) {
      console.error('Fetch notifs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  return (
    <div className="notifs-drawer">
      <div className="notifs-header">
        <h2>Notifications</h2>
      </div>

      <div className="notifs-list">
        {loading ? (
          <div className="notifs-msg">Loading notifications...</div>
        ) : notifs.length > 0 ? (
          notifs.map((n) => (
            <div key={n.id} className="notif-item">
              <Link to={`/profile/${n.sender.username}`} onClick={onClose}>
                <img src={n.sender.avatar} alt={n.sender.username} className="notif-avatar" />
              </Link>
              <div className="notif-text-box">
                <Link to={`/profile/${n.sender.username}`} onClick={onClose} className="notif-user-bold">
                  {n.sender.username}
                </Link>{' '}
                {n.type === 'like' && 'liked your post.'}
                {n.type === 'comment' && 'commented on your post.'}
                {n.type === 'follow' && 'started following you.'}
                <div className="notif-time">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="notifs-msg">No recent notifications.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
