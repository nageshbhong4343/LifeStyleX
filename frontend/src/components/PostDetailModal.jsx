import React, { useState, useEffect } from 'react';
import { X, Heart, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import API from '../services/api';
import './PostDetailModal.css';

const PostDetailModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fetchPostDetails = async () => {
    try {
      const res = await API.get(`/posts/${postId}`);
      setPost(res.data);
      setIsLiked(res.data.is_liked);
      setLikesCount(res.data.likes_count);

      const commentsRes = await API.get(`/posts/${postId}/comments`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('Fetch post detail error:', err);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleLikeToggle = async () => {
    try {
      const res = await API.post(`/posts/${postId}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      console.error('Like toggle error:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await API.post(`/posts/${postId}/comments`, { text: newComment });
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  if (!post) return null;

  return (
    <div className="modal-overlay">
      <button className="close-modal-btn" onClick={onClose}>
        <X size={24} color="#fff" />
      </button>

      <div className="modal-card post-detail-card">
        <div className="detail-media-side">
          <img src={post.image_url} alt="Post" className="detail-img" />
        </div>

        <div className="detail-info-side">
          {/* Header */}
          <div className="detail-header">
            <img src={post.user.avatar} alt={post.user.username} className="detail-user-avatar" />
            <span className="detail-username">{post.user.username}</span>
          </div>

          {/* Comments List */}
          <div className="detail-comments-scroll">
            {/* Caption as first comment */}
            {post.caption && (
              <div className="comment-detail-row">
                <img src={post.user.avatar} alt={post.user.username} className="comment-avatar" />
                <div className="comment-text-box">
                  <span className="comment-user-bold">{post.user.username}</span>{' '}
                  <span>{post.caption}</span>
                  <div className="comment-meta">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</div>
                </div>
              </div>
            )}

            {comments.map((c) => (
              <div key={c.id} className="comment-detail-row">
                <img src={c.user.avatar} alt={c.user.username} className="comment-avatar" />
                <div className="comment-text-box">
                  <span className="comment-user-bold">{c.user.username}</span>{' '}
                  <span>{c.text}</span>
                  <div className="comment-meta">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions & Likes */}
          <div className="detail-actions-section">
            <div className="detail-action-buttons">
              <button onClick={handleLikeToggle}>
                <Heart size={24} fill={isLiked ? 'var(--accent-red)' : 'none'} color={isLiked ? 'var(--accent-red)' : 'var(--text-primary)'} />
              </button>
            </div>
            <div className="detail-likes-text">{likesCount} likes</div>
          </div>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="detail-comment-form">
            <Smile size={20} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {newComment.trim() && <button type="submit">Post</button>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
