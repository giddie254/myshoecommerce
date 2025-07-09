// controllers/adminController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/User.js';
import Review from '../models/reviewModel.js'; // ✅ import

// ------------------- USER MANAGEMENT -------------------

export const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const total = await User.countDocuments(keyword);
  const users = await User.find(keyword)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// ------------------- DASHBOARD STATS -------------------

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
  ]);

  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();

  const recentSales = await Order.find({ isPaid: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  const topProducts = await Product.find()
    .sort({ rating: -1 })
    .limit(5)
    .select('name price rating images');

  res.json({
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    recentSales,
    topProducts,
  });
});

// ------------------- REVIEW MODERATION -------------------

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name')
    .populate('product', 'name images');
  res.json(reviews);
});

export const toggleReviewApproval = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  review.approved = !review.approved;
  await review.save();
  res.json({ message: 'Review status updated', review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await review.remove();
  res.json({ message: 'Review deleted' });
});
