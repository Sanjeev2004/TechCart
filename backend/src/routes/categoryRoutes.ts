import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, admin } from '../middlewares/auth';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, upload.single('image'), createCategory);

router.route('/:id')
  .delete(protect, admin, deleteCategory);

export default router;
