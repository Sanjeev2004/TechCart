import { Request, Response, NextFunction } from 'express';
import Wishlist from '../models/Wishlist';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }
    
    // populate before returning
    await wishlist.populate('products');
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
      await wishlist.populate('products');
    }
    
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Move to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
export const moveToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    
    // 1. Remove from Wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
      await wishlist.save();
    }

    // 2. Add to Cart
    let cart = await Cart.findOne({ user: req.user._id });
    const product = await Product.findById(productId);
    
    if (!product) {
       res.status(404);
       throw new Error('Product not found');
    }

    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: 1,
      stock: product.stock
    };

    if (cart) {
      const existItem = cart.items.find(x => x.product.toString() === productId);
      if (existItem) {
        existItem.quantity += 1;
      } else {
        cart.items.push(cartItem);
      }
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items: [cartItem] });
    }

    res.json({ wishlist, cart });
  } catch (error) {
    next(error);
  }
};
