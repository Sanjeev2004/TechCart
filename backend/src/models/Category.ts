import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });

export default mongoose.model<ICategory>('Category', categorySchema);
