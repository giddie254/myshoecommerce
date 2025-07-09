import express from 'express';
import {
  getBanners,
  createBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../controllers/bannerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/banners')
  .get(getBanners)
  .post(protect, isAdmin, upload.single('image'), createBanner);

router
  .route('/banners/:id')
  .delete(protect, isAdmin, deleteBanner);

router
  .put('/banners/:id/toggle', protect, isAdmin, toggleBannerStatus);

export default router;
