// controllers/mpesaController.js
import asyncHandler from 'express-async-handler';
import MpesaTransaction from '../models/mpesaTransactionModel.js';

// @desc Get all MPESA transactions (admin)
// @route GET /api/admin/mpesa-transactions
export const getMpesaTransactions = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  let filter = {};
  if (status) filter.status = status;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ phone: regex }, { mpesaCode: regex }];
  }

  const transactions = await MpesaTransaction.find(filter).sort({ createdAt: -1 });
  res.json(transactions);
});
