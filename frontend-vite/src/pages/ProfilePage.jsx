// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  HeartIcon,
  TruckIcon,
  LogOutIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  Edit3Icon
} from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';
import { logoutUser } from '../redux/slices/authSlice';
import axios from 'axios';

const ProfilePage = () => {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-h1 mb-4">Profile</h1>
        <p className="text-gray-600">
          You need to <Link to="/auth" className="text-primary hover:underline">log in</Link> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-h1 mb-6">Welcome, {user.name} 👋</h1>

      {/* Top Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" /> Profile Info
            </h2>
            <Link
              to="/profile/edit"
              className="flex items-center text-sm text-primary hover:underline"
            >
              <Edit3Icon className="w-4 h-4 mr-1" /> Edit
            </Link>
          </div>
          <p className="text-sm text-gray-700 mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Phone:</strong> {user.phone || 'Not Provided'}</p>
          <p className="text-sm text-gray-700"><strong>Member Since:</strong> {formatDateTime(user.createdAt)}</p>
        </div>

        {/* Quick Access */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/wishlist" className="flex items-center gap-2 text-text-primary hover:text-primary">
                <HeartIcon className="w-5 h-5" /> My Wishlist
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="flex items-center gap-2 text-text-primary hover:text-primary">
                <TruckIcon className="w-5 h-5" /> My Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center gap-2 text-text-primary hover:text-primary">
                <ShoppingCartIcon className="w-5 h-5" /> My Cart
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="flex items-center gap-2 text-text-primary hover:text-primary">
                <CreditCardIcon className="w-5 h-5" /> Checkout
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:underline">
                <LogOutIcon className="w-5 h-5" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-10 card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {loadingOrders ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map(order => (
                  <tr key={order._id} className="border-t dark:border-gray-600">
                    <td className="p-3">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">KSh {order.total}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">
                      <Link to={`/order/${order._id}`} className="text-primary hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <Link to="/my-orders" className="text-sm text-primary hover:underline">View All Orders →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;



