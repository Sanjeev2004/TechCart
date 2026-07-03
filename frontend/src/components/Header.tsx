'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, Package } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { fetchProducts } from '@/store/slices/productSlice';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    router.push('/');
  };

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathname === '/') {
        dispatch(fetchProducts(searchTerm));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, pathname]);

  const totalCartItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            TechCart
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2.5 px-5 pr-12 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition backdrop-blur-sm"
            />
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/cart" className="relative flex items-center px-4 py-2 rounded-xl hover:bg-white/10 transition">
            <ShoppingCart size={20} className="mr-1.5" />
            <span className="text-sm font-medium">Cart</span>
            {mounted && totalCartItems > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {totalCartItems}
              </span>
            )}
          </Link>
          {mounted && userInfo ? (
            <div className="relative group cursor-pointer">
              <div className="flex items-center px-4 py-2 rounded-xl hover:bg-white/10 transition">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2 text-xs font-bold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{userInfo.name}</span>
              </div>
              <div className="absolute right-0 mt-1 w-52 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 hidden group-hover:block overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userInfo.name}</p>
                  <p className="text-xs text-gray-500">{userInfo.email}</p>
                </div>
                <Link href="/profile" className="block px-4 py-2.5 hover:bg-blue-50 text-sm font-medium transition">
                  My Profile
                </Link>
                {userInfo.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block px-4 py-2.5 hover:bg-blue-50 text-sm font-medium transition">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={logoutHandler} className="w-full text-left block px-4 py-2.5 hover:bg-red-50 text-sm font-medium text-red-600 transition border-t border-gray-100">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium text-sm">
              <User size={18} className="mr-1.5" />
              <span>Login</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-gray-900/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <Link href="/cart" className="flex items-center py-2 px-3 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={18} className="mr-3" /> Cart {mounted && totalCartItems > 0 && `(${totalCartItems})`}
            </Link>
            {mounted && userInfo ? (
              <>
                <Link href="/profile" className="flex items-center py-2 px-3 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                  <User size={18} className="mr-3" /> Profile
                </Link>
                <button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} className="flex items-center py-2 px-3 rounded-lg hover:bg-white/10 text-red-400 w-full">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center py-2 px-3 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} className="mr-3" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
