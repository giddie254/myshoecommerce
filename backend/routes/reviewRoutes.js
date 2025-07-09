// --- routes/reviewRoutes.js ---
import express from 'express';
import { addOrUpdateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:productId').post(protect, addOrUpdateReview);
router.route('/:productId/:reviewId').delete(protect, deleteReview);

export default router;
