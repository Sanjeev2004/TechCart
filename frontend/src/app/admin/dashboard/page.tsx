'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-4 rounded-full"><DollarSign className="w-8 h-8 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${data?.totalRevenue?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-full"><ShoppingCart className="w-8 h-8 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{data?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-purple-100 p-4 rounded-full"><Users className="w-8 h-8 text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{data?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-yellow-100 p-4 rounded-full"><Package className="w-8 h-8 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Products</p>
            <h3 className="text-2xl font-bold text-gray-900">{data?.totalProducts || 0}</h3>
          </div>
        </div>
      </div>

      {/* Simplified Chart Area */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Sales Trend</h2>
        <div className="h-64 flex items-end space-x-4">
          {data?.recentOrders?.map((item: any, i: number) => {
            // Very simple CSS bar chart based on totalSales
            const maxSales = Math.max(...data.recentOrders.map((o: any) => o.totalSales));
            const heightPercentage = maxSales > 0 ? (item.totalSales / maxSales) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600" 
                  style={{ height: `${heightPercentage}%`, minHeight: '10%' }}
                ></div>
                <div className="mt-2 text-xs text-gray-500 font-medium">Month {item._id}</div>
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs py-1 px-2 rounded transition pointer-events-none">
                  ${item.totalSales.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
