import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, moveToCart } from '../controllers/wishlistController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/:productId')
  .delete(protect, removeFromWishlist);

router.post('/:productId/move-to-cart', protect, moveToCart);

export default router;
