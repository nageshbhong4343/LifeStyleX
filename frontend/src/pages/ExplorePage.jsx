import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import API from '../services/api';
import PostDetailModal from '../components/PostDetailModal';
import './ExplorePage.css';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const fetchExplorePosts = async () => {
    try {
      const res = await API.get('/posts/explore');
      setPosts(res.data);
    } catch (err) {
      console.error('Fetch explore posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="explore-page-container">
      <div className="explore-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="explore-post-card"
            onClick={() => setSelectedPostId(post.id)}
          >
            <img src={post.image_url} alt="Explore post" className="explore-post-img" />
            <div className="explore-post-overlay">
              <div className="overlay-stat">
                <Heart size={22} fill="#fff" color="#fff" />
                <span>{post.likes_count}</span>
              </div>
              <div className="overlay-stat">
                <MessageCircle size={22} fill="#fff" color="#fff" />
                <span>{post.comments_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
};

export default ExplorePage;
