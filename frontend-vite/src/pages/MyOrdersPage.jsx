import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) fetchOrders();
  }, [user, token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-text-primary dark:text-white">
        My Orders
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <img src="/images/no-orders.svg" alt="No orders" className="w-48 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/shop"
            className="btn-primary inline-block px-6 py-2 text-sm rounded-full"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3 text-xs sm:text-sm font-mono truncate max-w-[120px]">
                    {order._id}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary">
                    KSh {order.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-primary text-sm hover:underline font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;

