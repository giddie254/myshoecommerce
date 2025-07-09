// src/pages/admin/pages/OrdersList.jsx
import React, { useEffect, useState } from 'react';
import { EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../../components/Pagination';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders?page=${page}&limit=10`);
        setOrders(data.orders);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-white">Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total (KSh)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Paid</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Delivered</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3">{order._id}</td>
                      <td className="px-4 py-3">
                        <p>{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3">KSh {order.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                          {order.isPaid ? 'Paid' : 'Not Paid'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${order.isDelivered ? 'text-green-600' : 'text-yellow-500'}`}>
                          {order.isDelivered ? 'Delivered' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-KE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default OrdersList;

