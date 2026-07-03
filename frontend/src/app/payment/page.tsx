'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { savePaymentMethod } from '../../store/slices/cartSlice';
import CheckoutSteps from '../../components/CheckoutSteps';

export default function PaymentPage() {
  const { shippingAddress, paymentMethod: savedMethod } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  
  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push('/shipping');
    }
  }, [shippingAddress, router]);

  const [paymentMethod, setPaymentMethod] = useState(savedMethod || 'Stripe');
  const dispatch = useDispatch();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    router.push('/placeorder');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <CheckoutSteps step1 step2 step3 />
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Payment Method</h1>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-gray-900 text-lg">Stripe (Credit Card)</span>
            </label>
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-gray-900 text-lg">Razorpay</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 transition mt-8"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
