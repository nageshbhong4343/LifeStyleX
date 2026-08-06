import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './StoryModal.css';

const StoryModal = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  if (!currentStory) return null;

  return (
    <div className="modal-overlay story-modal-overlay">
      <button className="close-story-btn" onClick={onClose}>
        <X size={28} color="#fff" />
      </button>

      {currentIndex > 0 && (
        <button className="story-nav-btn prev" onClick={handlePrev}>
          <ChevronLeft size={32} color="#fff" />
        </button>
      )}

      <div className="story-content-card">
        {/* Progress Bar */}
        <div className="story-progress-bar-container">
          <div className="story-progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* User Info Header */}
        <div className="story-header-info">
          <img src={currentStory.user?.avatar} alt={currentStory.user?.username} className="story-header-avatar" />
          <span className="story-header-username">{currentStory.user?.username}</span>
        </div>

        {/* Story Image */}
        <img src={currentStory.image_url} alt="Story" className="story-media" />
      </div>

      {currentIndex < stories.length - 1 && (
        <button className="story-nav-btn next" onClick={handleNext}>
          <ChevronRight size={32} color="#fff" />
        </button>
      )}
    </div>
  );
};

export default StoryModal;
