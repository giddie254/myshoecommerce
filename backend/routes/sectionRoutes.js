// routes/sectionRoutes.js
import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { getHomepageSections, updateHomepageSections } from '../controllers/sectionController.js';

const router = express.Router();

router.get('/', protect, isAdmin, getHomepageSections);
router.put('/', protect, isAdmin, updateHomepageSections);

export default router;
