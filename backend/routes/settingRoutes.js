// ============================
// src/routes/settingRoutes.js
// ============================

import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/settingController.js';

const router = express.Router();

// All routes below require admin authentication
router.use(protect, isAdmin);

// @route GET /api/admin/settings
router.get('/', getSettings);

// @route PUT /api/admin/settings
router.put('/', updateSettings);

export default router;

