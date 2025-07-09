// src/pages/admin/components/TopSellingProducts.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'AirMax Pro', value: 400 },
  { name: 'Nike Flex', value: 300 },
  { name: 'Adidas Boost', value: 300 },
  { name: 'Puma Runner', value: 200 },
];

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

const TopSellingProducts = () => {
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-white">Top Selling Products</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingProducts;
