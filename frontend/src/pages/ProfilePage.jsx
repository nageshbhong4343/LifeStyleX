import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Bookmark, Tag, Heart, MessageCircle, Settings } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostDetailModal from '../components/PostDetailModal';
import EditProfileModal from '../components/EditProfileModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const isOwnProfile = currentUser && currentUser.username === username;

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userRes = await API.get(`/users/${username}`);
      setProfileUser(userRes.data);
      setIsFollowing(userRes.data.is_following);
      setFollowersCount(userRes.data.followers_count);

      const postsRes = await API.get(`/posts/user/${username}`);
      setPosts(postsRes.data);

      if (isOwnProfile) {
        const savedRes = await API.get('/posts/saved');
        setSavedPosts(savedRes.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      const res = await API.post(`/users/${profileUser.id}/follow`);
      setIsFollowing(res.data.following);
      setFollowersCount((prev) => (res.data.following ? prev + 1 : prev - 1));
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profileUser) {
    return <div className="profile-error">User not found</div>;
  }

  const displayedPosts = activeTab === 'saved' ? savedPosts : posts;

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="profile-avatar-container">
          <img src={profileUser.avatar} alt={profileUser.username} className="profile-avatar-img" />
        </div>

        <div className="profile-details-column">
          <div className="profile-username-row">
            <h2 className="profile-username">{profileUser.username}</h2>
            {isOwnProfile ? (
              <button onClick={() => setEditModalOpen(true)} className="btn-secondary edit-profile-btn">
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={isFollowing ? 'btn-secondary' : 'btn-primary'}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="profile-stats-row">
            <span><strong>{profileUser.posts_count}</strong> posts</span>
            <span><strong>{followersCount}</strong> followers</span>
            <span><strong>{profileUser.following_count}</strong> following</span>
          </div>

          <div className="profile-bio-section">
            <div className="profile-fullname">{profileUser.full_name}</div>
            <p className="profile-bio-text">{profileUser.bio}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <Grid size={14} /> POSTS
        </button>
        {isOwnProfile && (
          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={14} /> SAVED
          </button>
        )}
        <button
          className={`tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
          onClick={() => setActiveTab('tagged')}
        >
          <Tag size={14} /> TAGGED
        </button>
      </div>

      {/* Grid */}
      <div className="profile-posts-grid">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <div
              key={post.id}
              className="grid-post-card"
              onClick={() => setSelectedPostId(post.id)}
            >
              <img src={post.image_url} alt="Post" className="grid-post-img" />
              <div className="grid-post-overlay">
                <div className="overlay-stat">
                  <Heart size={20} fill="#fff" color="#fff" />
                  <span>{post.likes_count}</span>
                </div>
                <div className="overlay-stat">
                  <MessageCircle size={20} fill="#fff" color="#fff" />
                  <span>{post.comments_count}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-grid-msg">No posts to display</div>
        )}
      </div>

      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}

      {editModalOpen && (
        <EditProfileModal
          onClose={() => setEditModalOpen(false)}
          onUpdated={fetchProfileData}
        />
      )}
    </div>
  );
};

export default ProfilePage;
