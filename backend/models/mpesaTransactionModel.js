// models/mpesaTransactionModel.js
import mongoose from 'mongoose';

const mpesaTransactionSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    mpesaCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('MpesaTransaction', mpesaTransactionSchema);
