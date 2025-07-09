// routes/adminRoutes.js or mpesaRoutes.js
import express from 'express';
import { getMpesaTransactions } from '../controllers/mpesaController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin/mpesa-transactions', protect, adminOnly, getMpesaTransactions);

export default router;
