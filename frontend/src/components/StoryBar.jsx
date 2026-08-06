import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StoryModal from './StoryModal';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './StoryBar.css';

const StoryBar = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const fetchStories = async () => {
    try {
      const res = await API.get('/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="story-bar-container">
      {/* Current User Add Story Ring */}
      {user && (
        <div className="story-item" onClick={() => alert('To create a story, use the Create button on the sidebar!')}>
          <div className="story-avatar-wrapper add-story">
            <img src={user.avatar} alt={user.username} className="story-avatar" />
            <div className="add-icon-badge">
              <Plus size={12} color="#fff" />
            </div>
          </div>
          <span className="story-username">Your story</span>
        </div>
      )}

      {/* Other Active Stories */}
      {stories.map((story, index) => (
        <div
          key={story.id}
          className="story-item"
          onClick={() => setActiveStoryIndex(index)}
        >
          <div className="story-avatar-container">
            <div className="story-avatar-inner">
              <img src={story.image_url || story.user?.avatar} alt={story.user?.username} className="story-avatar-img" />
            </div>
          </div>
          <span className="story-username">{story.user?.username}</span>
        </div>
      ))}

      {activeStoryIndex !== null && (
        <StoryModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}
    </div>
  );
};

export default StoryBar;
