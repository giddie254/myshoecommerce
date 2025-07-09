// utils/createNotification.js
import Notification from '../models/notificationModel.js';

const createNotification = async ({ userId, message, type = 'system', io }) => {
  const notification = await Notification.create({
    user: userId,
    message,
    type,
  });

  // Emit real-time update
  if (io) {
    io.to(userId.toString()).emit('newNotification', notification);
  }
};

export default createNotification;
