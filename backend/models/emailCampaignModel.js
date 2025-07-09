// models/emailCampaignModel.js
import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  image: String, // Optional banner/image
  sentTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);
export default EmailCampaign;
