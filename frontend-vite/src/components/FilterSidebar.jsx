// src/components/FilterSidebar.jsx
import React from 'react';

const FilterSidebar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Filters</h3>
      <div>
        <h4 className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-300">Category</h4>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className={`block w-full text-left px-2 py-1 rounded text-sm ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;
