import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderDelivered,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getMyOrders);
router.route('/all').get(protect, adminOnly, getAllOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, adminOnly, markOrderDelivered);

export default router;

