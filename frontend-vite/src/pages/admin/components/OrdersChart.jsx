// src/pages/admin/components/OrdersChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'Week 1', orders: 120 },
  { week: 'Week 2', orders: 98 },
  { week: 'Week 3', orders: 145 },
  { week: 'Week 4', orders: 170 },
];

const OrdersChart = () => {
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">Orders This Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="orders" stroke="#6366F1" fillOpacity={1} fill="url(#colorOrders)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;
