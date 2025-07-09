import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', sales: 400 },
  { name: 'Feb', sales: 600 },
  { name: 'Mar', sales: 800 },
  { name: 'Apr', sales: 700 },
  { name: 'May', sales: 1000 },
  { name: 'Jun', sales: 650 },
];

const ProductSalesChart = () => {
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">Product Sales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductSalesChart;