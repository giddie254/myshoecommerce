// src/components/ui/select.jsx
import React from "react";

export const Select = ({ value, onChange, children, ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      {...props}
    >
      {children}
    </select>
  );
};
