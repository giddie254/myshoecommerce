// src/models/couponModel.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number, // percentage e.g. 10 = 10%
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number, // max total uses
      default: 0, // 0 = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who used coupon
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.expiresAt > now &&
    (this.usageLimit === 0 || this.usedCount < this.usageLimit)
  );
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
