// models/sectionModel.js
import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  sections: [
    {
      name: { type: String, required: true },
      visible: { type: Boolean, default: true },
    },
  ],
});

const HomepageSection = mongoose.model('HomepageSection', sectionSchema);
export default HomepageSection;