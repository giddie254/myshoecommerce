// src/pages/OrderSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
        Order Confirmed!
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-base max-w-md mb-6">
        🎉 Thank you for your purchase with <span className="font-semibold text-primary">SokoHive</span>! 
        Your order is now being processed. We’ll send you an update once it ships.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/my-orders"
          className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-light transition"
        >
          View My Orders
        </Link>

        <Link
          to="/shop"
          className="px-6 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium text-text-primary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;


