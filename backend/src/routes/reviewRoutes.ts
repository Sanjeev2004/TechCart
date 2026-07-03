import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.get('/product/:productId', getProductReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
