// routes/emailRoutes.js
import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { sendMarketingEmail, getEmailCampaigns } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send', protect, isAdmin, sendMarketingEmail);
router.get('/history', protect, isAdmin, getEmailCampaigns);

export default router;
