'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(''));
  }, [dispatch]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-3xl p-12 text-center md:text-left flex flex-col md:flex-row items-center shadow-2xl">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Discover the New Era of <span className="text-blue-300">Premium Tech</span>
          </h1>
          <p className="text-lg text-blue-100">
            Unbeatable prices on the latest gadgets. Shop our exclusive collection today.
          </p>
          <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1">
            Shop Now
          </button>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          {/* Decorative element for hero */}
          <div className="w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-blue-600 w-2 h-8 mr-3 rounded-full"></span>
          Latest Arrivals
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
