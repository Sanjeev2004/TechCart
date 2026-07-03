'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchProducts } from '@/store/slices/productSlice';
import ProductCard from '@/components/ProductCard';
import { Loader2, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(''));
  }, [dispatch]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center shadow-2xl overflow-hidden relative">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="md:w-1/2 space-y-6 relative z-10">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4 mr-2 text-yellow-300" />
            New Arrivals 2026 Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Discover the <br />
            <span className="bg-gradient-to-r from-blue-200 via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Future of Tech
            </span>
          </h1>
          <p className="text-lg text-blue-100/90 max-w-md">
            Unbeatable prices on the latest gadgets. Shop premium electronics from world-class brands.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#products" className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-1 hover:shadow-xl">
              Shop Now
            </Link>
            <Link href="/login" className="border-2 border-white/30 text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition transform hover:-translate-y-1 backdrop-blur-sm">
              Join Free
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative z-10">
          <div className="relative">
            <div className="w-72 h-72 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <div className="w-56 h-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse border border-white/10">
                <div className="text-center">
                  <p className="text-5xl font-black">⚡</p>
                  <p className="text-sm font-semibold mt-2 text-blue-100">Premium Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
          { icon: Shield, label: 'Secure Payment', desc: '256-bit SSL encryption' },
          { icon: RotateCcw, label: 'Easy Returns', desc: '30-day return policy' },
          { icon: Zap, label: 'Fast Delivery', desc: '2-3 business days' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
              <item.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">{item.label}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section id="products">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-b from-blue-600 to-indigo-600 w-1.5 h-8 mr-3 rounded-full"></span>
            Latest Arrivals
          </h2>
          <p className="text-gray-500 text-sm hidden md:block">{products.length} products available</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="h-64 shimmer"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 shimmer rounded w-3/4"></div>
                  <div className="h-4 shimmer rounded w-1/2"></div>
                  <div className="h-6 shimmer rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            <p className="font-semibold text-lg">Something went wrong</p>
            <p className="text-sm mt-1">{error}</p>
            <button onClick={() => dispatch(fetchProducts(''))} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition">
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-xl font-semibold text-gray-700">No products found</p>
            <p className="text-gray-500 mt-2">Check back soon for new arrivals!</p>
          </div>
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
