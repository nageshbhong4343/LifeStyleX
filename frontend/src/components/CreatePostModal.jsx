import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import API from '../services/api';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('caption', caption);

      await API.post('/posts/', formData);
      onPostCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to upload post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <button className="close-modal-btn" onClick={onClose}>
        <X size={24} color="#fff" />
      </button>

      <div className="modal-card create-post-card">
        <div className="create-post-header">
          <h3>Create new post</h3>
          {previewUrl && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="share-btn"
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          )}
        </div>

        <div className="create-post-body">
          {!previewUrl ? (
            <div className="dropzone">
              <ImageIcon size={64} color="var(--text-secondary)" />
              <p>Select photos and videos here</p>
              <label className="btn-primary select-file-btn">
                Select from computer
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </div>
          ) : (
            <div className="preview-container">
              <div className="preview-media-box">
                <img src={previewUrl} alt="Preview" className="preview-img" />
              </div>
              <div className="caption-input-box">
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
