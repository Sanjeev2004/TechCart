import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Fetch all products with Search, Filters, Sorting, Pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          $text: { $search: req.query.keyword as string },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};
    
    // Price filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter = { price: {} };
      if (req.query.minPrice) (priceFilter as any).price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) (priceFilter as any).price.$lte = Number(req.query.maxPrice);
    }

    const filter = { ...keyword, ...category, ...brand, ...priceFilter };

    // Sorting
    let sortObj: any = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc': sortObj = { price: 1 }; break;
        case 'price_desc': sortObj = { price: -1 }; break;
        case 'rating': sortObj = { ratings: -1 }; break;
        case 'newest': sortObj = { createdAt: -1 }; break;
      }
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('category', 'name slug');

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, brand, sku, stock } = req.body;
    
    let images: { url: string; public_id: string }[] = [];

    // Handle multiple file uploads
    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file: Express.Multer.File) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      sku,
      stock,
      images,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category, brand, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Delete images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
      
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const relatedProducts = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
      }).limit(4).populate('category', 'name slug');

      res.json(relatedProducts);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
