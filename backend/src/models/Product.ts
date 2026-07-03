import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: { url: string; public_id: string }[];
  category: mongoose.Types.ObjectId;
  brand: string;
  sku: string;
  stock: number;
  ratings: number;
  numOfReviews: number;
  specifications: Map<string, string>;
  isFeatured: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0 },
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for Search, Category, Price, and Ratings
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratings: -1 });

export default mongoose.model<IProduct>('Product', productSchema);
