// src/models/settingModel.js
import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: String, default: '' },
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
