// --- controllers/userController.js ---
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { logActivity } from '../utils/LogActivity.js';

// @desc Get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc Get single user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) res.json(user);
  else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Update user (admin only)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const oldName = user.name;
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin ?? user.isAdmin;

  const updated = await user.save();

  await logActivity({
    action: 'Updated User',
    description: `User "${oldName}" updated to "${updated.name}"`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { userId: updated._id },
  });

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isAdmin: updated.isAdmin,
  });
});

// @desc Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isAdmin) {
    res.status(403);
    throw new Error('Cannot delete admin user');
  }

  await user.remove();

  await logActivity({
    action: 'Deleted User',
    description: `User "${user.name}" was deleted.`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { userId: user._id },
  });

  res.json({ message: 'User removed' });
});
