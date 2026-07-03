'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err: any) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (error) return <div className="text-red-500 font-bold">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-medium text-gray-700 rounded-tl-lg">ID</th>
              <th className="p-4 font-medium text-gray-700">USER</th>
              <th className="p-4 font-medium text-gray-700">DATE</th>
              <th className="p-4 font-medium text-gray-700">TOTAL</th>
              <th className="p-4 font-medium text-gray-700">PAID</th>
              <th className="p-4 font-medium text-gray-700">DELIVERED</th>
              <th className="p-4 font-medium text-gray-700 rounded-tr-lg text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-sm text-gray-600">{order._id.substring(0, 10)}...</td>
                <td className="p-4 font-medium text-gray-900">{order.user && order.user.name}</td>
                <td className="p-4 text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4">
                  {order.isPaid ? (
                    <CheckCircle className="w-5 h-5 text-green-500 inline" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 inline" />
                  )}
                </td>
                <td className="p-4">
                  {order.isDelivered ? (
                    <CheckCircle className="w-5 h-5 text-green-500 inline" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 inline" />
                  )}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/order/${order._id}`}>
                    <span className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1.5 px-4 rounded-full text-sm font-medium transition">
                      Details
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
