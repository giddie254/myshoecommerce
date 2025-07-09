// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const { settings, loading } = useSettings();

  return (
    <footer className="bg-background-dark text-text-dark pt-10 pb-6 px-6 md:px-12 lg:px-24">
      <div className="grid gap-10 md:grid-cols-4">

        {/* Logo + About */}
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
            <img src="/logo.svg" alt="sokoHive logo" className="w-8 h-8" />
            {settings.siteName || 'sokoHive'}
          </Link>
          <p className="text-sm text-text-darkSecondary leading-relaxed">
            {settings.siteDescription || 'Discover stylish shoes, clothing, electronics and accessories from trusted brands. Your smart shopping partner.'}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
            <li><Link to="/auth" className="hover:text-primary">Login / Register</Link></li>
            <li><Link to="/my-orders" className="hover:text-primary">My Orders</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
            <li><Link to="/shipping" className="hover:text-primary">Shipping Info</Link></li>
            <li><Link to="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Support</Link></li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Stay in Touch</h3>
          <form className="mb-4">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 text-sm rounded-md bg-background-darkSecondary text-white placeholder:text-text-darkSecondary border border-gray-600 focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="mt-2 w-full px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-orange-500 transition-colors"
            >
              Subscribe
            </button>
          </form>

          <div className="text-sm space-y-1">
            {settings.supportEmail && (
              <p className="flex items-center gap-2 text-text-darkSecondary">
                <Mail className="w-4 h-4" /> {settings.supportEmail}
              </p>
            )}
            {settings.supportPhone && (
              <p className="flex items-center gap-2 text-text-darkSecondary">
                <Phone className="w-4 h-4" /> {settings.supportPhone}
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-text-darkSecondary hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.twitter && (
              <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-text-darkSecondary hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-text-darkSecondary hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-text-darkSecondary">
        {settings.footerText || `© ${new Date().getFullYear()} sokoHive. All rights reserved.`}
      </div>
    </footer>
  );
};

export default Footer;


