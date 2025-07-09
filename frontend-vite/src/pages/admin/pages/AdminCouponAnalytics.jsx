import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminCouponAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/admin/coupons/analytics/summary');
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary dark:text-white mb-4">
        Coupon Analytics
      </h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Coupon Summary Cards */}
          {analytics.map((coupon) => (
            <div
              key={coupon.code}
              className="rounded-xl shadow-md bg-white dark:bg-gray-800 p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-text-primary dark:text-white">
                  {coupon.code}
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    coupon.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Discount: {coupon.discount}% | Usage:{' '}
                {coupon.usedCount}/{coupon.usageLimit || '∞'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Orders Used: {coupon.timesUsed} | Revenue Generated:{' '}
                <strong>KSh {coupon.revenueGenerated.toLocaleString()}</strong>
              </p>
            </div>
          ))}

          {/* Bar Chart */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h3 className="text-md font-semibold text-text-primary dark:text-white mb-2">
              Revenue Chart by Coupon
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analytics}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="code" stroke="#888" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar
                  dataKey="revenueGenerated"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponAnalytics;

