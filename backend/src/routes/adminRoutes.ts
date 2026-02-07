import express from 'express';
import { getAnalytics } from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getAnalytics);

export default router;
