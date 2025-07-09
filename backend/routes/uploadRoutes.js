// --- routes/uploadRoutes.js ---
import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage, uploadProductImages } from '../controllers/uploadController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, or WEBP images are allowed'));
  }
};

// ✅ Only define once here
const upload = multer({ storage, fileFilter });

// @route   POST /api/upload
// @access  Private/Admin (single image)
router.post(
  '/',
  protect,
  isAdmin,
  (req, res, next) => {
    upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadImage
);

// @route   POST /api/upload/multiple
// @access  Private/Admin (multiple images)
router.post(
  '/multiple',
  protect,
  isAdmin,
  upload.array('images', 4),
  uploadProductImages
);

export default router;
