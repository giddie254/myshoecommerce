// src/admin/components/AdminLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import { initSocket } from '../utils/socket';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const menu = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, path: '/admin/dashboard' },
    { name: 'Products', icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { name: 'Orders', icon: <ShoppingCart className="w-4 h-4" />, path: '/admin/orders' },
    { name: 'Users', icon: <Users className="w-4 h-4" />, path: '/admin/users' },
  ];

  useEffect(() => {
    if (token) {
      const socket = initSocket(token);
      socket.on('notification', (data) => {
        setNotifications((prev) => [data, ...prev]);
        toast.success(data.message || 'New alert received');
      });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary mb-6">SokoHive Admin</h1>
          <nav className="flex flex-col gap-2">
            {menu.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 mt-6 text-sm text-red-500 hover:underline"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between md:hidden bg-white dark:bg-gray-900">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-200 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-text-primary">Admin</h2>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">
          {notifications.length > 0 && (
            <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded">
              <strong>Latest:</strong> {notifications[0].message}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


