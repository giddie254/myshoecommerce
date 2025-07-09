// controllers/wishlistController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/productModel.js';
import { logActivity } from '../utils/LogActivity.js';

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();

    const product = await Product.findById(productId);

    await logActivity({
      action: 'Added to Wishlist',
      description: `User "${user.name}" added "${product?.name || 'a product'}" to wishlist.`,
      performedBy: user._id,
      ipAddress: req.ip,
      meta: { productId },
    });
  }

  res.status(200).json({ message: 'Product added to wishlist' });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(productId)) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    const product = await Product.findById(productId);

    await logActivity({
      action: 'Removed from Wishlist',
      description: `User "${user.name}" removed "${product?.name || 'a product'}" from wishlist.`,
      performedBy: user._id,
      ipAddress: req.ip,
      meta: { productId },
    });
  }

  res.status(200).json({ message: 'Product removed from wishlist' });
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
});
