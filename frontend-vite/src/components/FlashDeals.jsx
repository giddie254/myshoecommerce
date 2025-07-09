// src/components/FlashDeals.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(endTime));

  function getRemainingTime(end) {
    const total = Date.parse(end) - Date.now();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getRemainingTime(endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.total <= 0) return <span className="text-red-500">Expired</span>;

  return (
    <span className="text-sm text-orange-600 font-medium">
      {timeLeft.days > 0 && `${timeLeft.days}d `}{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

const FlashDeals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await axios.get('/api/products/flash');
        setDeals(data || []);
      } catch (err) {
        console.error('Failed to load flash deals', err);
      }
    };
    fetchDeals();
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="py-12 px-6 md:px-20 bg-gradient-to-br from-orange-50 to-white dark:from-background-dark dark:to-background-darkSecondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
          Flash Deals 🔥
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {deals.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white dark:bg-background-darkSecondary p-4 rounded-card shadow hover:shadow-lg transition transform hover:scale-105"
            >
              <img
                src={product.images?.[0] || '/images/placeholder.png'}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-base font-semibold text-text-primary dark:text-white truncate">
                {product.name}
              </h3>
              <p className="text-sm text-secondary dark:text-text-darkSecondary mb-2">
                {formatCurrency(product.price)}
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {product.rating?.toFixed(1) || '4.5'}
                </span>
                <CountdownTimer endTime={product.flashDealEnd || Date.now() + 3600000} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
