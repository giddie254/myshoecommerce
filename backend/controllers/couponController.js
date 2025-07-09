
// ✅ couponController.js
import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';
import { logActivity } from '../utils/LogActivity.js';

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new Error('Coupon code is required');
  const normalizedCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: normalizedCode });
  if (!coupon || !coupon.isActive || coupon.expiresAt < new Date() || (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)) {
    res.status(400);
    throw new Error('Invalid or expired coupon code');
  }
  if (coupon.usedBy.includes(req.user._id)) {
    res.status(400);
    throw new Error('You have already used this coupon');
  }
  res.json({ success: true, code: coupon.code, discount: coupon.discount });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiresAt, usageLimit } = req.body;
  if (!code || !discount || !expiresAt || usageLimit === undefined) {
    res.status(400);
    throw new Error('All fields are required');
  }
  const normalizedCode = code.trim().toUpperCase();
  const exists = await Coupon.findOne({ code: normalizedCode });
  if (exists) throw new Error('Coupon code already exists');

  const newCoupon = await Coupon.create({
    code: normalizedCode,
    discount,
    expiresAt,
    usageLimit,
    isActive: true,
    usedCount: 0,
    usedBy: [],
  });

  await logActivity({ action: 'Created Coupon', description: `Coupon "${normalizedCode}" created with ${discount}% discount.`, performedBy: req.user._id, ipAddress: req.ip, meta: { couponId: newCoupon._id } });

  res.status(201).json(newCoupon);
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new Error('Coupon not found');
  await logActivity({ action: 'Deleted Coupon', description: `Coupon "${coupon.code}" was deleted.`, performedBy: req.user._id, ipAddress: req.ip, meta: { couponId: coupon._id } });
  res.json({ message: 'Coupon deleted successfully' });
});

export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new Error('Coupon not found');
  coupon.isActive = !coupon.isActive;
  await coupon.save();
  await logActivity({ action: 'Toggled Coupon Status', description: `Coupon "${coupon.code}" was ${coupon.isActive ? 'activated' : 'deactivated'}.`, performedBy: req.user._id, ipAddress: req.ip, meta: { couponId: coupon._id } });
  res.json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}`, status: coupon.isActive });
});

export const getCouponAnalytics = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  const orders = await Order.find({ couponCode: { $ne: null } });
  const analytics = coupons.map((coupon) => {
    const code = coupon.code.toUpperCase();
    const matchingOrders = orders.filter(order => order.couponCode?.toUpperCase() === code);
    const timesUsed = matchingOrders.length;
    const revenueGenerated = matchingOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    return { code, discount: coupon.discount, isActive: coupon.isActive, usageLimit: coupon.usageLimit, usedCount: coupon.usedCount, timesUsed, revenueGenerated };
  });
  res.json(analytics);
});

export const getActiveCoupons = asyncHandler(async (req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({ isActive: true, expiresAt: { $gte: now } }).sort({ createdAt: -1 });
  res.json(coupons);
});