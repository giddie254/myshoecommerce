import React from "react";

export const Textarea = ({ value, onChange, placeholder, ...props }) => {
  return (
    <textarea
      className="w-full rounded-xl border border-gray-300 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
};
