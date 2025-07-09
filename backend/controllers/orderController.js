// src/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';
import User from '../models/User.js';
import { sendSms } from '../utils/sendSms.js';
import { logActivity } from '../utils/LogActivity.js';

// Create a new order
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    couponCode,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let appliedCoupon = null;
  let discountAmount = 0;
  let totalPrice = itemsPrice + shippingPrice;

  // Apply coupon if provided
  if (couponCode) {
    const normalizedCode = couponCode.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (
      coupon &&
      coupon.isActive &&
      coupon.expiresAt > new Date() &&
      (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit) &&
      !coupon.usedBy.includes(req.user._id)
    ) {
      discountAmount = (coupon.discount / 100) * itemsPrice;
      totalPrice -= discountAmount;

      coupon.usedCount += 1;
      coupon.usedBy.push(req.user._id);
      await coupon.save();

      appliedCoupon = coupon.code;
    } else {
      res.status(400);
      throw new Error('Invalid or expired coupon');
    }
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    couponCode: appliedCoupon || null,
  });

  const createdOrder = await order.save();

  // Send SMS notification
  const user = await User.findById(req.user._id);
  if (user?.phone && user.name) {
    try {
      await sendSms(
        user.phone,
        `Hello ${user.name}, your order ${createdOrder._id} has been received! We’ll keep you updated.`
      );
    } catch (smsErr) {
      console.error('SMS failed:', smsErr.message);
    }
  }

  // Emit real-time event
  req.app.get('io')?.emit('newOrder', createdOrder);

  await logActivity({
    action: 'Created Order',
    description: `Order ${createdOrder._id} placed by ${req.user.name}`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { orderId: createdOrder._id },
  });

  res.status(201).json(createdOrder);
});

// Get user's orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// Get single order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// Get all orders (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
});

// Mark order as delivered (Admin)
export const markOrderDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  await logActivity({
    action: 'Marked Order Delivered',
    description: `Order ${order._id} marked as delivered by admin ${req.user.name}`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { orderId: order._id },
  });

  res.json(updatedOrder);
});

// Get order statistics
export const getOrderStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const paidOrders = orders.filter((order) => order.isPaid).length;

  res.json({
    totalOrders,
    paidOrders,
    totalRevenue,
  });
});

// Paginated orders (Admin)
export const getOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

