// src/pages/admin/components/AnalyticsCard.jsx
import React from 'react';

const AnalyticsCard = ({ title, value, icon: Icon, color = 'text-primary', bg = 'bg-white' }) => {
  return (
    <div className={`p-6 rounded-xl shadow-sm ${bg} dark:bg-gray-800`}> 
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {Icon && <Icon className={`w-5 h-5 ${color}`} />}
      </div>
      <p className="text-2xl font-bold text-text-primary dark:text-white">{value}</p>
    </div>
  );
};

export default AnalyticsCard;

