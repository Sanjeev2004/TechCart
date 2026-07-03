import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

// @desc    Get dashboard analytics 
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Sales over the last 6 months (simplified)
    const recentOrders = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalSales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};
