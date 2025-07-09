// src/models/productModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isFlashDeal: { type: Boolean, default: false },
    flashDealStart: { type: Date },
    flashDealEnd: { type: Date },
  },
  { timestamps: true }
);

productSchema.methods.updateRating = async function () {
  const totalRating = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.numReviews = this.reviews.length;
  this.rating = this.reviews.length ? totalRating / this.reviews.length : 0;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);
export default Product;

