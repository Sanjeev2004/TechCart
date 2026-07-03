import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category';
import Product from './models/Product';
import User from './models/User';

dotenv.config();

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Laptops, phones, tablets and more' },
  { name: 'Audio', slug: 'audio', description: 'Headphones, speakers and audio gear' },
  { name: 'Wearables', slug: 'wearables', description: 'Smartwatches, fitness trackers' },
  { name: 'Accessories', slug: 'accessories', description: 'Cases, chargers and peripherals' },
];

const seedProducts = [
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook ever. The M3 Max chip delivers exceptional performance for demanding workflows. Features a stunning 16-inch Liquid Retina XDR display, up to 128GB unified memory, and all-day battery life.',
    price: 207499,
    brand: 'Apple',
    sku: 'MBP-16-M3MAX',
    stock: 15,
    ratings: 4.8,
    numOfReviews: 234,
    isFeatured: true,
    categorySlug: 'electronics',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'macbook_pro_16' }],
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max features a titanium design, the A17 Pro chip, a 48MP camera system with 5x optical zoom, and USB-C with USB 3 speeds. Experience the most powerful iPhone ever made.',
    price: 99599,
    brand: 'Apple',
    sku: 'IPH-15-PROMAX',
    stock: 50,
    ratings: 4.7,
    numOfReviews: 892,
    isFeatured: true,
    categorySlug: 'electronics',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'iphone_15_pro' }],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Search like never before, effortlessly edit photos, and Icons/features a built-in S Pen, 200MP camera, and titanium frame built to last.',
    price: 107899,
    brand: 'Samsung',
    sku: 'SGS-24-ULTRA',
    stock: 35,
    ratings: 4.6,
    numOfReviews: 567,
    isFeatured: true,
    categorySlug: 'electronics',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'galaxy_s24' }],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours battery life with quick charging.',
    price: 29049,
    brand: 'Sony',
    sku: 'SONY-WH1000XM5',
    stock: 80,
    ratings: 4.9,
    numOfReviews: 1245,
    isFeatured: true,
    categorySlug: 'audio',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'sony_xm5' }],
  },
  {
    name: 'AirPods Pro 2nd Gen',
    description: 'Rebuilt from the sound up. Featuring the Apple H2 chip, Adaptive Audio, and up to 2x more Active Noise Cancellation. USB-C charging case with precision finding.',
    price: 20749,
    brand: 'Apple',
    sku: 'APP-PRO-2',
    stock: 120,
    ratings: 4.7,
    numOfReviews: 2100,
    isFeatured: false,
    categorySlug: 'audio',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'airpods_pro' }],
  },
  {
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch ever. Features a precision dual-frequency GPS, 36-hour battery life, 100m water resistance, and the brightest Always-On display.',
    price: 66399,
    brand: 'Apple',
    sku: 'AW-ULTRA-2',
    stock: 25,
    ratings: 4.8,
    numOfReviews: 456,
    isFeatured: true,
    categorySlug: 'wearables',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'watch_ultra' }],
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    description: 'Classic design meets modern innovation. Features a rotating bezel, advanced health monitoring, BioActive Sensor, and Wear OS by Google with Samsung customization.',
    price: 33199,
    brand: 'Samsung',
    sku: 'SGW-6-CLASSIC',
    stock: 40,
    ratings: 4.4,
    numOfReviews: 312,
    isFeatured: false,
    categorySlug: 'wearables',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'galaxy_watch' }],
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'Supercharged by the M2 chip. Stunning 12.9-inch Liquid Retina XDR display with ProMotion. Works with Apple Pencil hover for a magical new experience.',
    price: 91299,
    brand: 'Apple',
    sku: 'IPAD-PRO-129',
    stock: 30,
    ratings: 4.7,
    numOfReviews: 678,
    isFeatured: true,
    categorySlug: 'electronics',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'ipad_pro' }],
  },
  {
    name: 'MagSafe Charger for iPhone',
    description: 'Perfectly aligned magnets attach to your iPhone 12 or later and provide faster wireless charging up to 15W. Works with Qi-compatible devices too.',
    price: 3319,
    brand: 'Apple',
    sku: 'MAG-CHARGER',
    stock: 200,
    ratings: 4.3,
    numOfReviews: 890,
    isFeatured: false,
    categorySlug: 'accessories',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'magsafe_charger' }],
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'The iconic productivity mouse, now quieter and faster. Features an 8K DPI sensor, quiet clicks, MagSpeed scroll wheel, and works on virtually any surface.',
    price: 8299,
    brand: 'Logitech',
    sku: 'LOG-MX3S',
    stock: 65,
    ratings: 4.8,
    numOfReviews: 1567,
    isFeatured: false,
    categorySlug: 'accessories',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'mx_master' }],
  },
  {
    name: 'Sony WF-1000XM5 Earbuds',
    description: 'The best noise cancelling truly wireless earbuds. Incredibly small and comfortable with exceptional sound quality. Features LDAC and DSEE Extreme audio upscaling.',
    price: 24899,
    brand: 'Sony',
    sku: 'SONY-WF1000XM5',
    stock: 55,
    ratings: 4.6,
    numOfReviews: 876,
    isFeatured: false,
    categorySlug: 'audio',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'sony_earbuds' }],
  },
  {
    name: 'Dell XPS 15 OLED Laptop',
    description: 'Stunning 15.6-inch 3.5K OLED display with 100% DCI-P3 color. Powered by 13th Gen Intel Core i9, 32GB RAM, and 1TB SSD. Premium all-aluminum build.',
    price: 157699,
    brand: 'Dell',
    sku: 'DELL-XPS15-OLED',
    stock: 20,
    ratings: 4.5,
    numOfReviews: 432,
    isFeatured: true,
    categorySlug: 'electronics',
    images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', public_id: 'dell_xps' }],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected for seeding...');

    // --- Seed Categories ---
    console.log('Seeding categories...');
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const cat of categories) {
      const result = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true, new: true }
      );
      categoryMap[cat.slug] = result._id as mongoose.Types.ObjectId;
      console.log(`  ✓ Category: ${cat.name}`);
    }

    // --- Seed Products ---
    console.log('Seeding products...');
    for (const prod of seedProducts) {
      const { categorySlug, ...productData } = prod;
      await Product.findOneAndUpdate(
        { sku: productData.sku },
        { $set: { ...productData, category: categoryMap[categorySlug] } },
        { upsert: true, new: true }
      );
      console.log(`  ✓ Product: ${prod.name}`);
    }

    // --- Seed Admin User ---
    console.log('Seeding admin user...');
    const adminExists = await User.findOne({ email: 'admin@techcart.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@techcart.com',
        password: 'Admin123!',
        role: 'admin',
      });
      console.log('  ✓ Admin user created (admin@techcart.com / Admin123!)');
    } else {
      console.log('  ✓ Admin user already exists');
    }

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
