import Link from 'next/link';

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  return (
    <nav className="flex justify-center mb-10">
      <ul className="flex items-center space-x-2 md:space-x-8 text-sm md:text-base font-medium">
        <li className={`${step1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          {step1 ? <Link href="/login">Sign In</Link> : <span>Sign In</span>}
        </li>
        <li className="text-gray-300">/</li>
        <li className={`${step2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          {step2 ? <Link href="/shipping">Shipping</Link> : <span>Shipping</span>}
        </li>
        <li className="text-gray-300">/</li>
        <li className={`${step3 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          {step3 ? <Link href="/payment">Payment</Link> : <span>Payment</span>}
        </li>
        <li className="text-gray-300">/</li>
        <li className={`${step4 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
          {step4 ? <Link href="/placeorder">Place Order</Link> : <span>Place Order</span>}
        </li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;
