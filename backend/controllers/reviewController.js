// --- controllers/reviewController.js ---
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { logActivity } from '../utils/LogActivity.js';

// Add or update review
export const addOrUpdateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existingReview = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  let action = 'Added Review';
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = new Date();
    action = 'Updated Review';
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });
  }

  await product.updateRating();

  await logActivity({
    action,
    description: `${req.user.name} ${action.toLowerCase()} on product "${product.name}"`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { productId: product._id },
  });

  res.json({ message: 'Review submitted' });
});

// Delete review (user or admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(reviewId);

  if (
    !review ||
    (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin)
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  review.remove();
  await product.updateRating();

  await logActivity({
    action: 'Deleted Review',
    description: `Review deleted from product "${product.name}" by ${req.user.name}`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { productId: product._id, reviewId },
  });

  res.json({ message: 'Review removed' });
});
