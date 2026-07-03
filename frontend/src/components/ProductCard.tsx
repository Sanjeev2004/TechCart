import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    ratings: number;
    numOfReviews: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <Link href={`/product/${product._id}`} className="relative h-64 w-full bg-gray-100 flex items-center justify-center overflow-hidden p-4 group">
        <Image
          src={product.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
        />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mt-2 mb-4 space-x-1">
          <Star className="text-yellow-400 fill-current w-4 h-4" />
          <span className="text-sm font-medium text-gray-600">{product.ratings.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.numOfReviews} reviews)</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
