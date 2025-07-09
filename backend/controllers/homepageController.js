import asyncHandler from 'express-async-handler';
import HomepageSection from '../models/homepageSectionModel.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Testimonial from '../models/testimonialModel.js';

// ✅ Admin: Get all homepage layout sections
export const getSections = asyncHandler(async (req, res) => {
  const sections = await HomepageSection.find().sort('order');
  res.json(sections);
});

// ✅ Admin: Update section visibility/order
export const updateSections = asyncHandler(async (req, res) => {
  const updates = req.body; // array of { key, visible, order }

  for (const update of updates) {
    await HomepageSection.findOneAndUpdate({ key: update.key }, update, { new: true });
  }

  res.json({ message: 'Sections updated' });
});

// ✅ Admin: Seed default homepage sections
export const seedSections = asyncHandler(async (req, res) => {
  const defaults = [
    { key: 'hero', label: 'Hero Slider', order: 0 },
    { key: 'featured', label: 'Featured Products', order: 1 },
    { key: 'new_arrivals', label: 'New Arrivals', order: 2 },
    { key: 'top_deals', label: 'Top Deals', order: 3 },
    { key: 'flash_sale', label: 'Flash Sale', order: 4 },
    { key: 'categories', label: 'Popular Categories', order: 5 },
    { key: 'testimonials', label: 'Testimonials', order: 6 },
    { key: 'newsletter', label: 'Newsletter Signup', order: 7 },
  ];

  await HomepageSection.deleteMany();
  await HomepageSection.insertMany(defaults.map((s) => ({ ...s, visible: true })));

  res.json({ message: 'Sections seeded' });
});

// ✅ Public: Get full homepage content
export const getHomepageData = asyncHandler(async (req, res) => {
  const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
  const flashDeals = await Product.find({
    isFlashDeal: true,
    flashDealStart: { $lte: new Date() },
    flashDealEnd: { $gte: new Date() },
  }).limit(8);
  const featuredCategories = await Category.find({ isFeatured: true }).limit(6);
  const testimonials = await Testimonial.find({ approved: true }).limit(5);

  res.json({ featuredProducts, flashDeals, featuredCategories, testimonials });
});

// ✅ Public: Get testimonials only
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
  res.json(testimonials);
});

// ✅ Public: Get featured categories only
export const getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isFeatured: true });
  res.json(categories);
});

