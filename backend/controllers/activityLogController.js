// controllers/activityLogController.js
import asyncHandler from 'express-async-handler';
import ActivityLog from '../models/activityLogModel.js';

// @desc    Get all admin activity logs
// @route   GET /api/admin/activity-logs
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(200);
  res.json(logs);
});

