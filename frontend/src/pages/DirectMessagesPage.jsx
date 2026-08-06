import React, { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Smile, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DirectMessagesPage.css';

const DirectMessagesPage = () => {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
      if (res.data.length > 0 && !activeUser) {
        setActiveUser(res.data[0]);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesWithUser = async (targetUser) => {
    if (!targetUser) return;
    try {
      const res = await API.get(`/messages/${targetUser.id}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetchMessagesWithUser(activeUser);
    }
  }, [activeUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;

    try {
      const res = await API.post('/messages/', {
        receiver_id: activeUser.id,
        text: text
      });
      setMessages((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="direct-page-container">
      {/* Contact List Side */}
      <div className="direct-contacts-sidebar">
        <div className="contacts-header">
          <h2>{currentUser?.username}</h2>
        </div>
        <div className="messages-section-title">Messages</div>
        <div className="contacts-list">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`contact-item ${activeUser?.id === c.id ? 'active' : ''}`}
              onClick={() => setActiveUser(c)}
            >
              <img src={c.avatar} alt={c.username} className="contact-avatar" />
              <div className="contact-info">
                <span className="contact-username">{c.username}</span>
                <span className="contact-fullname">{c.full_name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Side */}
      <div className="direct-chat-area">
        {activeUser ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <img src={activeUser.avatar} alt={activeUser.username} className="chat-user-avatar" />
              <div className="chat-user-details">
                <span className="chat-username">{activeUser.username}</span>
                <span className="chat-status">Active now</span>
              </div>
            </div>

            {/* Message History */}
            <div className="chat-messages-history">
              {messages.map((m) => {
                const isSentByMe = m.sender_id === currentUser.id;
                return (
                  <div key={m.id} className={`message-bubble-wrapper ${isSentByMe ? 'sent' : 'received'}`}>
                    {!isSentByMe && (
                      <img src={activeUser.avatar} alt="Avatar" className="bubble-avatar" />
                    )}
                    <div className={`message-bubble ${isSentByMe ? 'my-bubble' : 'their-bubble'}`}>
                      <p>{m.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <Smile size={24} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {text.trim() && (
                <button type="submit" className="send-msg-btn">
                  Send
                </button>
              )}
            </form>
          </>
        ) : (
          <div className="no-active-chat">
            <MessageCircle size={64} color="var(--text-secondary)" />
            <h3>Your Messages</h3>
            <p>Send private photos and messages to a friend.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessagesPage;
