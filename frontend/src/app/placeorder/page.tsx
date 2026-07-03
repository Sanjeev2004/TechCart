'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearCartItems } from '@/store/slices/cartSlice';
import CheckoutSteps from '@/components/CheckoutSteps';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PlaceOrderPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted) {
      if (!cart.shippingAddress.street) {
        router.push('/shipping');
      } else if (!cart.paymentMethod) {
        router.push('/payment');
      }
    }
  }, [cart.shippingAddress, cart.paymentMethod, router, mounted]);

  const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const res = await api.post('/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      dispatch(clearCartItems());
      router.push(`/order/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error placing order');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Shipping</h2>
            <p className="mt-2 text-gray-700">
              {cart.shippingAddress.street}, {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.state}, {cart.shippingAddress.zipCode},{' '}
              {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Payment Method</h2>
            <p className="text-gray-700">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded bg-gray-50 p-1" />
                    <div className="flex-1">
                      <Link href={`/product/${item.product}`} className="font-medium hover:text-blue-600 transition">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-900 font-medium whitespace-nowrap">
                      {item.quantity} x ₹{addDecimals(item.price)} = <span className="font-bold">₹{addDecimals(item.quantity * item.price)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-gray-600">
                <span>Items:</span>
                <span className="font-medium text-gray-900">₹{addDecimals(itemsPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Shipping:</span>
                <span className="font-medium text-gray-900">₹{addDecimals(shippingPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Tax:</span>
                <span className="font-medium text-gray-900">₹{addDecimals(taxPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">
                <span>Total:</span>
                <span>₹{addDecimals(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0 || loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-full shadow hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
