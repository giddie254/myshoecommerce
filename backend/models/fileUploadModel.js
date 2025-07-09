// models/fileUploadModel.js
import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    format: { type: String },
    resource_type: { type: String }, // image, video, raw
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('FileUpload', fileUploadSchema);
