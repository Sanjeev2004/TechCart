import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import Order from '../models/Order';

const updateProductRatings = async (productId: string) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating =
    numReviews === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    ratings: rating,
    numOfReviews: numReviews,
  });
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { product: productId, rating, comment } = req.body;

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    // Optional: check if user bought the product
    const hasBought = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      isPaid: true
    });

    if (!hasBought && req.user.role !== 'admin') {
      res.status(400);
      throw new Error('You can only review products you have purchased');
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await updateProductRatings(productId);

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
      }

      review.rating = rating || review.rating;
      review.comment = comment || review.comment;

      const updatedReview = await review.save();
      await updateProductRatings(review.product.toString());

      res.json(updatedReview);
    } else {
      res.status(404);
      throw new Error('Review not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
      }

      await Review.deleteOne({ _id: review._id });
      await updateProductRatings(review.product.toString());

      res.json({ message: 'Review removed' });
    } else {
      res.status(404);
      throw new Error('Review not found');
    }
  } catch (error) {
    next(error);
  }
};
