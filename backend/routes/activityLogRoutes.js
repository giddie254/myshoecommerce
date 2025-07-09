// routes/activityLogRoutes.js
import express from 'express';
import { getActivityLogs } from '../controllers/activityLogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();
router.get('/', protect, adminOnly, getActivityLogs);
export default router;

