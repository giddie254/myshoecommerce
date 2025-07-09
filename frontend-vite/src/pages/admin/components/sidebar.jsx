// src/pages/admin/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  PlusCircle,
  ShoppingCart,
  LogOut,
  BellRing,
  MailOpen,
  UploadCloud,
  ImageIcon,
  Warehouse,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const { pathname } = useLocation();

  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, to: '/admin' },
    { name: 'Products', icon: <Package className="w-4 h-4" />, to: '/admin/products' },
    { name: 'Add Product', icon: <PlusCircle className="w-4 h-4" />, to: '/admin/products/new' },
    { name: 'Orders', icon: <ShoppingCart className="w-4 h-4" />, to: '/admin/orders' },
    { name: 'Users', icon: <Users className="w-4 h-4" />, to: '/admin/users' },
    { name: 'Messages', icon: <MailOpen className="w-4 h-4" />, to: '/admin/messages' },
    { name: 'Inventory', icon: <Warehouse className="w-4 h-4" />, to: '/admin/inventory' },
    { name: 'Banners', icon: <ImageIcon className="w-4 h-4" />, to: '/admin/banners' },
    { name: 'File Manager', icon: <UploadCloud className="w-4 h-4" />, to: '/admin/files' },
    { name: 'Alerts', icon: <BellRing className="w-4 h-4" />, to: '/admin/alerts' },
    { name: 'Banners', icon: <ImageIcon />, to: '/admin/banners' },
    { name: 'Email Marketing', icon: <SendHorizontal />, to: '/admin/email-marketing' },
    { label: 'Homepage Settings', href: '/admin/homepage-settings' }



  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 shadow-md p-6 space-y-4 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:shadow-none`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-primary">SokoHive Admin</h1>
        <button
          onClick={onClose}
          className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition
              ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="flex items-center gap-2 px-3 py-2 mt-4 text-sm text-red-500 hover:underline"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
