// src/components/ui/input.jsx
import React from "react";

export const Input = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      {...props}
    />
  );
};
