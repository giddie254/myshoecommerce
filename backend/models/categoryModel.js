import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
