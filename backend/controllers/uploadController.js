// --- controllers/uploadController.js ---
import asyncHandler from 'express-async-handler';
import path from 'path';

export const uploadImage = asyncHandler((req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  const imageUrls = req.files.map((file) => file.path);
  res.status(201).json({ images: imageUrls });
});

