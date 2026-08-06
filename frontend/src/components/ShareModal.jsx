import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Send, Share2 } from 'lucide-react';
import API from '../services/api';
import './ShareModal.css';

const ShareModal = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const postUrl = window.location.origin + `/profile/${post.user.username}`;
  const shareText = `Check out this post by @${post.user.username} on LifeStyleX!`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/messages/conversations');
        setUsers(res.data);
      } catch (err) {
        console.error('Fetch users for share error:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDM = async () => {
    if (!selectedUser) return;
    setSendingMsg(true);
    try {
      await API.post('/messages/', {
        receiver_id: selectedUser.id,
        text: `${shareText}\n${post.image_url}`
      });
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error sending share message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay">
      <button className="close-modal-btn" onClick={onClose}>
        <X size={24} color="#fff" />
      </button>

      <div className="modal-card share-modal-card">
        <div className="share-modal-header">
          <h3>Share Post</h3>
        </div>

        <div className="share-modal-body">
          {/* Social Share External Buttons */}
          <div className="social-buttons-row">
            <button onClick={shareToWhatsApp} className="social-platform-btn whatsapp">
              <span className="platform-icon">💬</span>
              <span>WhatsApp</span>
            </button>
            <button onClick={shareToTwitter} className="social-platform-btn twitter">
              <span className="platform-icon">𝕏</span>
              <span>Twitter</span>
            </button>
            <button onClick={shareToFacebook} className="social-platform-btn facebook">
              <span className="platform-icon">📘</span>
              <span>Facebook</span>
            </button>
          </div>

          {/* Copy Link Bar */}
          <div className="copy-link-bar">
            <input type="text" value={postUrl} readOnly />
            <button onClick={handleCopyLink} className="copy-btn">
              {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Send via Direct Message */}
          <div className="share-dm-section">
            <h4>Send to LifeStyleX Friend</h4>
            <div className="share-users-list">
              {users.map((u) => (
                <div
                  key={u.id}
                  className={`share-user-item ${selectedUser?.id === u.id ? 'selected' : ''}`}
                  onClick={() => setSelectedUser(u)}
                >
                  <img src={u.avatar} alt={u.username} className="share-user-avatar" />
                  <div className="share-user-info">
                    <span className="share-username">{u.username}</span>
                    <span className="share-fullname">{u.full_name}</span>
                  </div>
                  <input
                    type="radio"
                    name="share-user"
                    checked={selectedUser?.id === u.id}
                    onChange={() => setSelectedUser(u)}
                  />
                </div>
              ))}
            </div>

            {selectedUser && (
              <button
                onClick={handleSendDM}
                disabled={sendingMsg}
                className="btn-primary send-share-dm-btn"
              >
                {sentSuccess ? 'Sent! ✓' : sendingMsg ? 'Sending...' : `Send to @${selectedUser.username}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
