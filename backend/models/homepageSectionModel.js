import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const HomepageSection = mongoose.model('HomepageSection', sectionSchema);
export default HomepageSection;
