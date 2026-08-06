import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import API from '../services/api';
import PostDetailModal from './PostDetailModal';
import ShareModal from './ShareModal';
import './PostCard.css';

const PostCard = ({ post, onPostUpdated }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recentComments, setRecentComments] = useState(post.recent_comments || []);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleLikeToggle = async () => {
    try {
      const res = await API.post(`/posts/${post.id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      console.error('Like error', err);
    }
  };

  const handleDoubleTap = async () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);

    if (!isLiked) {
      handleLikeToggle();
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const res = await API.post(`/posts/${post.id}/bookmark`);
      setIsBookmarked(res.data.bookmarked);
    } catch (err) {
      console.error('Bookmark error', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/posts/${post.id}/comments`, { text: commentText });
      setRecentComments((prev) => [...prev, res.data]);
      setCommentsCount((prev) => prev + 1);
      setCommentText('');
    } catch (err) {
      console.error('Comment error', err);
    }
  };

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${post.user.username}`} className="post-user-info">
          <img src={post.user.avatar} alt={post.user.username} className="post-user-avatar" />
          <div className="post-user-names">
            <span className="post-username">{post.user.username}</span>
          </div>
        </Link>
        <button className="post-options-btn">
          <MoreHorizontal size={20} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Media with Double Tap */}
      <div className="post-media-container" onDoubleClick={handleDoubleTap}>
        <img src={post.image_url} alt="Post" className="post-media-img" />
        <div className={`heart-bounce ${showHeartAnim ? 'active' : ''}`}>
          <Heart size={90} fill="#ffffff" color="#ffffff" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="post-actions">
        <div className="left-actions">
          <button onClick={handleLikeToggle} className={`action-btn ${isLiked ? 'liked' : ''}`}>
            <Heart size={24} fill={isLiked ? 'var(--accent-red)' : 'none'} color={isLiked ? 'var(--accent-red)' : 'var(--text-primary)'} />
          </button>
          <button onClick={() => setDetailModalOpen(true)} className="action-btn">
            <MessageCircle size={24} />
          </button>
          <button onClick={() => setShareModalOpen(true)} className="action-btn">
            <Send size={24} />
          </button>
        </div>
        <button onClick={handleBookmarkToggle} className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}>
          <Bookmark size={24} fill={isBookmarked ? 'var(--text-primary)' : 'none'} />
        </button>
      </div>

      {/* Likes */}
      <div className="post-likes-count">
        <span>{likesCount.toLocaleString()} likes</span>
      </div>

      {/* Caption */}
      <div className="post-caption">
        <Link to={`/profile/${post.user.username}`} className="caption-username">
          {post.user.username}
        </Link>{' '}
        <span className="caption-text">{post.caption}</span>
      </div>

      {/* Comments Preview */}
      {commentsCount > 0 && (
        <button onClick={() => setDetailModalOpen(true)} className="view-comments-btn">
          View all {commentsCount} comments
        </button>
      )}

      <div className="recent-comments-list">
        {recentComments.slice(-2).map((c) => (
          <div key={c.id} className="comment-item-preview">
            <span className="comment-user">{c.user.username}</span>{' '}
            <span className="comment-text">{c.text}</span>
          </div>
        ))}
      </div>

      {/* Date */}
      <div className="post-date">
        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
      </div>

      {/* Add Comment Bar */}
      <form onSubmit={handleAddComment} className="add-comment-form">
        <Smile size={20} className="smile-icon" />
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
        />
        {commentText.trim() && (
          <button type="submit" className="post-comment-btn">
            Post
          </button>
        )}
      </form>

      {detailModalOpen && (
        <PostDetailModal
          postId={post.id}
          onClose={() => setDetailModalOpen(false)}
        />
      )}

      {shareModalOpen && (
        <ShareModal
          post={post}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </article>
  );
};

export default PostCard;
