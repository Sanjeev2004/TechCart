'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import api from '../../services/api';
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [delivering, setDelivering] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching order');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userInfo, router]);

  const successPaymentHandler = async () => {
    try {
      setPaying(true);
      await api.put(`/orders/${id}/pay`, {
        id: 'fake-stripe-id-123',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: { email_address: userInfo?.email },
      });
      // reload order
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const deliverHandler = async () => {
    try {
      setDelivering(true);
      await api.put(`/orders/${id}/deliver`);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delivery failed');
    } finally {
      setDelivering(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-20 font-bold">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Order {order._id}</h1>
        <a 
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${order._id}/invoice`} 
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          target="_blank"
          rel="noreferrer"
        >
          <Download className="w-5 h-5 mr-1" />
          Download Invoice
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Shipping</h2>
            <p className="mb-2"><strong>Name: </strong> {order.user.name}</p>
            <p className="mb-4"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-600">{order.user.email}</a></p>
            <p className="mb-4">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> Not Delivered
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Payment Method</h2>
            <p className="mb-4">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> Not Paid
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Order Items</h2>
            <ul className="space-y-4">
              {order.orderItems.map((item: any, index: number) => (
                <li key={index} className="flex items-center space-x-4">
                  <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-16 h-16 object-contain rounded bg-gray-50 p-1" />
                  <div className="flex-1">
                    <Link href={`/product/${item.product}`} className="font-medium hover:text-blue-600 transition">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-gray-700 font-medium">
                    {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Order Summary</h2>
            <div className="space-y-3 text-gray-700 mb-6">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-4">
                <button
                  onClick={successPaymentHandler}
                  disabled={paying}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-700 transition flex justify-center items-center"
                >
                  {paying ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay $${order.totalPrice.toFixed(2)} (Mock)`}
                </button>
              </div>
            )}

            {userInfo && userInfo.role === 'admin' && order.isPaid && !order.isDelivered && (
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={deliverHandler}
                  disabled={delivering}
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-full hover:bg-gray-800 transition flex justify-center items-center"
                >
                  {delivering ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mark As Delivered'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
