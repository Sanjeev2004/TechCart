'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, ListOrdered } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      router.push('/');
    }
  }, [userInfo, router]);

  if (!userInfo || userInfo.role !== 'admin') return null;

  return (
    <div className="flex flex-col md:flex-row min-h-[70vh] gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 rounded-3xl p-6 text-white shadow-xl h-fit">
        <h2 className="text-xl font-bold mb-8 tracking-wider text-gray-400 uppercase text-sm">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition">
            <ShoppingBag className="w-5 h-5 text-green-400" />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition">
            <ListOrdered className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="font-medium">Users</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
