'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchMyOrders();
    }
  }, [userInfo, router]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err: any) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setUpdating(true);
      const { data } = await api.put('/users/profile', {
        name,
        email,
        password,
      });
      dispatch(setCredentials(data));
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Profile Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Leave blank to keep same"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition flex justify-center mt-4"
              >
                {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
            
            {loadingOrders ? (
              <div className="flex justify-center py-10"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">You haven't placed any orders yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-medium text-gray-700 rounded-tl-lg">ID</th>
                      <th className="p-4 font-medium text-gray-700">DATE</th>
                      <th className="p-4 font-medium text-gray-700">TOTAL</th>
                      <th className="p-4 font-medium text-gray-700">PAID</th>
                      <th className="p-4 font-medium text-gray-700">DELIVERED</th>
                      <th className="p-4 font-medium text-gray-700 rounded-tr-lg"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-4 font-mono text-sm text-gray-600">{order._id.substring(0, 10)}...</td>
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
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
