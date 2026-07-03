import express from 'express';
import { getDashboardAnalytics } from '../controllers/adminController';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardAnalytics);

export default router;
