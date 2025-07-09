// src/pages/admin/components/UserGrowthChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const UserGrowthChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">
        User Signups (Last 6 Months)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="month" stroke="#888" />
          <YAxis stroke="#888" allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="signups" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;



