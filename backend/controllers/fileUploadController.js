// controllers/fileUploadController.js
import asyncHandler from 'express-async-handler';
import FileUpload from '../models/fileUploadModel.js';
import cloudinary from '../config/cloudinary.js';

// @desc Upload file
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: 'auto',
  });

  const file = await FileUpload.create({
    public_id: result.public_id,
    url: result.secure_url,
    format: result.format,
    resource_type: result.resource_type,
    uploadedBy: req.user._id,
  });

  res.status(201).json(file);
});

// @desc Get all uploads
export const getUploads = asyncHandler(async (req, res) => {
  const files = await FileUpload.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');
  res.json(files);
});

// @desc Delete upload
export const deleteUpload = asyncHandler(async (req, res) => {
  const file = await FileUpload.findById(req.params.id);
  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  await cloudinary.uploader.destroy(file.public_id, {
    resource_type: file.resource_type || 'image',
  });

  await file.deleteOne();
  res.json({ message: 'File deleted' });
});
