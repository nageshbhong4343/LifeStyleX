import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import './EditProfileModal.css';

const EditProfileModal = ({ onClose, onUpdated }) => {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar_file', avatarFile);
      }

      const res = await API.put('/users/profile', formData);
      setUser(res.data);
      if (onUpdated) onUpdated(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <button className="close-modal-btn" onClick={onClose}>
        <X size={24} color="#fff" />
      </button>

      <div className="modal-card edit-profile-card">
        <div className="edit-profile-header">
          <h3>Edit profile</h3>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-body">
          {/* Avatar Upload */}
          <div className="avatar-edit-section">
            <img src={avatarPreview} alt="Avatar" className="edit-avatar-img" />
            <label className="change-photo-btn">
              Change photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            </label>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              rows={4}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary submit-edit-btn">
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
