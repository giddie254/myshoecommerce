// src/routes/couponRoutes.js
import express from 'express';
import {
  validateCoupon,
  createCoupon,
  getCoupons,
  deleteCoupon,
  toggleCouponStatus,
  getCouponAnalytics,
  getActiveCoupons, // ✅ NEW
} from '../controllers/couponController.js';

import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ✅ Public Route: Get active coupons
router.get('/active', getActiveCoupons);

// ✅ Protected Route: Validate coupon
router.post('/validate', protect, validateCoupon);

// ✅ Admin Routes
router.post('/', protect, adminOnly, createCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.get('/analytics/summary', protect, adminOnly, getCouponAnalytics);
router.delete('/:id', protect, adminOnly, deleteCoupon);
router.put('/:id/toggle', protect, adminOnly, toggleCouponStatus);

export default router;



