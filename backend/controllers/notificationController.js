
// controllers/notificationController.js
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    res.status(404);
    throw new Error('Notification not found');
  }
  if (notif.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  notif.isRead = true;
  await notif.save();
  res.json({ message: 'Marked as read' });
});