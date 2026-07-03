import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    ratings: number;
    numOfReviews: number;
    brand?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col group">
      <Link href={`/product/${product._id}`} className="relative h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-4">
        <Image
          src={product.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain group-hover:scale-110 transition-transform duration-500 p-6"
        />
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-t-2xl"></div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        {product.brand && (
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{product.brand}</span>
        )}
        <Link href={`/product/${product._id}`}>
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mt-2 mb-3 space-x-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${
                  i < Math.round(product.ratings) 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-gray-200 fill-gray-200'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">({product.numOfReviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          <button className="bg-gray-900 hover:bg-blue-600 text-white p-2.5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
