'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addToCart, removeFromCart } from '@/store/slices/cartSlice';
import { Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const updateQuantity = (item: any, quantity: number) => {
    dispatch(addToCart({ ...item, quantity }));
  };

  const removeItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      router.push('/shipping');
    } else {
      router.push('/login?redirect=/shipping');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      {!mounted ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-6">Loading cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-6">Your cart is currently empty.</p>
          <Link href="/">
            <span className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
              Start Shopping
            </span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2" />
                  <div>
                    <Link href={`/product/${item.product}`}>
                      <span className="font-semibold text-lg hover:text-blue-600 transition line-clamp-1">{item.name}</span>
                    </Link>
                    <p className="text-gray-500 font-medium">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item, Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none"
                  >
                    {[...Array(Math.min(item.stock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button onClick={() => removeItem(item.product)} className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-full">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                  <span>₹{cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t">
                  <span>Total:</span>
                  <span>₹{cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
