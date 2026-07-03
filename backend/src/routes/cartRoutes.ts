import express from 'express';
import { getCart, syncCart, clearCart } from '../controllers/cartController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, syncCart)
  .delete(protect, clearCart);

export default router;
