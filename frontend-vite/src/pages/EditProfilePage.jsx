import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate saving profile changes (update Redux state only for now)
    dispatch(updateProfile(formData));
    toast.success('Profile updated successfully');
    navigate('/profile');
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-10">
      <h1 className="text-h1 mb-6 text-center">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded shadow-md">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            className="input w-full"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="input w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="input w-full"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Save Changes
        </button>

        <Link to="/profile" className="block text-center mt-4 text-sm text-primary hover:underline">
          ← Cancel and go back
        </Link>
      </form>
    </div>
  );
};

export default EditProfilePage;

