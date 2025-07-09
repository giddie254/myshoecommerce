// src/pages/OrderDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const statusClass = {
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[(order?.status || '').toLowerCase()] || 'bg-gray-100 text-gray-800';

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center animate-pulse">
        <h1 className="text-2xl font-semibold text-text-primary mb-4">Loading Order...</h1>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-center text-red-500">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <nav className="text-sm text-gray-500 mb-2">
        <Link to="/" className="hover:underline">Home</Link> &gt;{' '}
        <Link to="/my-orders" className="hover:underline">My Orders</Link> &gt;{' '}
        <span className="text-text-primary font-medium">Order #{order._id.slice(-6).toUpperCase()}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white">
        Order #{order._id.slice(-6).toUpperCase()}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Shipping Info</h2>
          <p><span className="font-medium">Name:</span> {order.user?.name}</p>
          <p><span className="font-medium">Email:</span> {order.user?.email}</p>
          <p><span className="font-medium">Address:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
          <p><span className="font-medium">Postal Code:</span> {order.shippingAddress?.postalCode}</p>
          <p><span className="font-medium">County:</span> {order.shippingAddress?.country}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Order Details</h2>
          <p><span className="font-medium">Date:</span> {formatDate(order.createdAt)}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
              {order.status}
            </span>
          </p>
          <p><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
          <p><span className="font-medium">Total:</span> {formatCurrency(order.totalPrice)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Ordered Items</h2>
        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Size</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900">
            {(order.items || []).map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-3 flex items-center gap-3">
                  <img src={item.product?.images?.[0]} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  <span>{item.name}</span>
                </td>
                <td className="p-3">{item.size}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{formatCurrency(item.price)}</td>
                <td className="p-3 font-semibold">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <Link to="/my-orders" className="inline-block text-sm text-primary hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;


