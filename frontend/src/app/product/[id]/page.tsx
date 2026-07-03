'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/services/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      quantity: qty,
      stock: product.stock,
    }));
    toast.success(`${product.name} added to cart!`);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold">Error Loading Product</h2>
        <p>{error}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          &larr; Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-center items-center relative h-96 min-h-[400px]">
          <Image
            src={product.images?.[0]?.url || 'https://via.placeholder.com/500'}
            alt={product.name}
            fill
            className="object-contain hover:scale-105 transition-transform duration-500 p-8"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
            <p className="text-gray-500 mt-2 font-medium">Brand: {product.brand}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.ratings) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-gray-600 font-medium">{product.ratings.toFixed(1)} Ratings</span>
            <span className="text-gray-400">({product.numOfReviews} reviews)</span>
          </div>

          <div className="border-t border-b border-gray-100 py-6">
            <span className="text-4xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            <p className="text-green-600 font-medium mt-2">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Action Area */}
          {product.stock > 0 && (
            <div className="pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="qty" className="text-gray-700 font-medium">Quantity:</label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                >
                  {[...Array(Math.min(product.stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={addToCartHandler}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all hover:-translate-y-1"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
