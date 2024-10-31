import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/users/profile');
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/${profile.id}`, formData);
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <button type="submit">Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {user.role === 'admin' && (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;