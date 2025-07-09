import express from 'express';
const router = express.Router();

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUsers,
  deleteUser,
} from '../controllers/authController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin Routes
router.get('/', protect, isAdmin, getUsers);       // List all users (admin only)
router.delete('/:id', protect, isAdmin, deleteUser); // Delete a user (admin only)

export default router;

