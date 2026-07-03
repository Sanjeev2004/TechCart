import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Private
export const syncCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { items } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
