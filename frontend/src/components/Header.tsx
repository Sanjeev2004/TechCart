'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { useState, useCallback, useEffect } from 'react';

const Header = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();
  const [searchTerm, setSearchTerm] = useState('');

  const logoutHandler = () => {
    dispatch(logout());
  };

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only dispatch if on home page or redirect to home page with search query
      if (window.location.pathname === '/') {
        dispatch(fetchProducts(searchTerm));
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wider">
          E-COMM
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-full text-black focus:outline-none"
            />
            <button className="absolute right-3 top-2 text-gray-500">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/cart" className="flex items-center hover:text-gray-300 transition">
            <ShoppingCart size={20} className="mr-1" />
            <span>Cart</span>
          </Link>
          {userInfo ? (
            <div className="relative group cursor-pointer">
              <div className="flex items-center hover:text-gray-300 transition">
                <User size={20} className="mr-1" />
                <span>{userInfo.name}</span>
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg hidden group-hover:block overflow-hidden">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                {userInfo.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </Link>
                )}
                <button onClick={logoutHandler} className="w-full text-left block px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center hover:text-gray-300 transition">
              <User size={20} className="mr-1" />
              <span>Login</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
