// routes/adminRoutes.js
import express from 'express';
import {
  getAdminStats,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getAllReviews,
  toggleReviewApproval,
  deleteReview,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 Protect all admin routes
router.use(protect, isAdmin);

// Admin: Users
router.get('/users', getUsers);
router
  .route('/user/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Admin: Dashboard stats
router.get('/stats', getAdminStats);

// ✅ Admin: Review moderation
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/toggle', toggleReviewApproval);
router.delete('/reviews/:id', deleteReview);

export default router;

