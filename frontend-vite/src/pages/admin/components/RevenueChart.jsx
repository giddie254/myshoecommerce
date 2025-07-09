// src/pages/admin/components/RevenueChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', revenue: 21000 },
  { month: 'Feb', revenue: 25000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 32000 },
  { month: 'May', revenue: 27000 },
  { month: 'Jun', revenue: 35000 },
];

const RevenueChart = () => {
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
