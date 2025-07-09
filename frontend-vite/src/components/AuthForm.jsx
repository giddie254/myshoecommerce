// src/components/AuthForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../redux/slices/authSlice';

const AuthForm = ({ isLogin, toggleMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await dispatch(loginUser(formData)).unwrap();
        toast.success('Login successful');
      } else {
        await dispatch(registerUser(formData)).unwrap();
        toast.success('Registration successful');
      }

      navigate('/');
    } catch (err) {
      toast.error(err || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="input w-full"
          value={formData.name}
          onChange={handleChange}
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input w-full"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input w-full"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="btn-primary w-full flex justify-center items-center"
        disabled={loading}
      >
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button type="button" onClick={toggleMode} className="text-primary hover:underline font-medium">
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </form>
  );
};

export default AuthForm;

