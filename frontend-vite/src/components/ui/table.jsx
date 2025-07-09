// src/components/ui/table.jsx
import React from "react";

export const Table = ({ children, className }) => (
  <table className={`w-full text-sm text-left ${className}`}>{children}</table>
);

export const TableHead = ({ children }) => (
  <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
);

export const TableRow = ({ children }) => <tr>{children}</tr>;

export const TableHeaderCell = ({ children }) => (
  <th className="px-4 py-2 font-semibold text-gray-700 dark:text-white">{children}</th>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableCell = ({ children }) => (
  <td className="px-4 py-2 border-b dark:border-gray-700">{children}</td>
);
