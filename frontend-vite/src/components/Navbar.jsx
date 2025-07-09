// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  ShoppingCart,
  User,
  Heart,
  X,
  LogOut,
  Phone,
} from 'lucide-react';
import Dropdown from './Dropdown';
import { logout } from '../redux/slices/authSlice';
import { useSettings } from '@/hooks/useSettings';
import axios from 'axios';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchActiveCoupon = async () => {
      try {
        const { data } = await axios.get('/api/coupons/active');
        setActiveCoupon(data);
      } catch (err) {
        console.error('No active coupon');
      }
    };
    fetchActiveCoupon();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate('/');
  };

  const categories = [
    { label: 'Sneakers', href: '/shop?cat=sneakers' },
    { label: 'Men', href: '/shop?cat=men' },
    { label: 'Women', href: '/shop?cat=women' },
    { label: 'Kids', href: '/shop?cat=kids' },
    { label: 'Sports', href: '/shop?cat=sports' },
    { label: 'Deals', href: '/shop?cat=deals' },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setMobileOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-background-primary dark:bg-background-dark border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Top Active Coupon Bar */}
      {activeCoupon && (
        <div className="bg-yellow-400 text-black text-xs font-semibold text-center py-2">
          🎁 Use code <span className="underline">{activeCoupon.code}</span> to get {activeCoupon.discount}% OFF - Hurry, ends soon!
        </div>
      )}

      {/* Top Support Bar */}
      {(settings.supportPhone || settings.whatsapp) && (
        <div className="bg-primary text-white text-xs px-4 py-2 flex items-center justify-between md:justify-center gap-4">
          {settings.supportPhone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> Call us: {settings.supportPhone}
            </span>
          )}
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-orange-100"
            >
              Chat via WhatsApp
            </a>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-heading text-primary dark:text-primary-light">
          <img src={settings.logo || '/logo.svg'} alt="Logo" className="w-8 h-8" />
          <span>{settings.siteName || 'sokoHive'}</span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search shoes, brands or categories"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-background-darkSecondary dark:text-white"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="hidden md:flex items-center gap-1 text-sm text-text-primary dark:text-text-dark hover:text-primary">
            <Heart className="w-4 h-4" /> Wishlist
          </Link>

          <Link to="/cart" className="relative text-sm text-text-primary dark:text-text-dark">
            <ShoppingCart className="w-5 h-5" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full px-1.5">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <Dropdown
              label={
                <span className="flex items-center gap-1 text-sm text-text-primary dark:text-text-dark">
                  <User className="w-4 h-4" /> {user.name.split(' ')[0]}
                </span>
              }
              items={[
                { label: 'My Profile', href: '/profile/edit' },
                { label: 'My Orders', href: '/my-orders' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'Logout', onClick: handleLogout, icon: <LogOut className="w-4 h-4" /> },
              ]}
            />
          ) : (
            <Link to="/auth" className="btn-primary text-sm px-3 py-1.5">Login</Link>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-text-primary dark:text-text-dark">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-background-darkSecondary dark:text-white"
          />
        </div>
      )}

      {/* Categories */}
      <div className="hidden md:flex gap-6 px-6 py-2 bg-gray-50 dark:bg-background-darkSecondary border-t dark:border-gray-700">
        <Dropdown label="Categories" items={categories} />
        {categories.map((cat) => (
          <Link
            key={cat.href}
            to={cat.href}
            className="text-sm text-text-primary dark:text-text-dark hover:text-primary"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className="block text-sm text-text-primary dark:text-text-dark hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {cat.label}
            </Link>
          ))}
          <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block text-sm">Wishlist</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block text-sm">Cart</Link>
          {user ? (
            <>
              <Link to="/profile/edit" onClick={() => setMobileOpen(false)} className="block text-sm">Profile</Link>
              <button onClick={handleLogout} className="block text-sm text-left w-full text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block text-sm">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
