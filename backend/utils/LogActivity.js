// utils/logActivity.js
import ActivityLog from '../models/activityLogModel.js';

export const logActivity = async ({ req, action, description }) => {
  try {
    if (!req?.user || !req?.user.isAdmin) return;

    const log = new ActivityLog({
      action,
      description,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.isAdmin ? 'admin' : 'user',
      },
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      path: req.originalUrl,
      method: req.method,
    });

    await log.save();
  } catch (err) {
    console.error('Activity log error:', err);
  }
};

