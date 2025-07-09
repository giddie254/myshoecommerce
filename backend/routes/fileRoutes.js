// routes/fileRoutes.js
import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadFile, getUploads, deleteUpload } from '../controllers/fileUploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/admin/uploads', protect, adminOnly, upload.single('file'), uploadFile);
router.get('/admin/uploads', protect, adminOnly, getUploads);
router.delete('/admin/uploads/:id', protect, adminOnly, deleteUpload);

export default router;
