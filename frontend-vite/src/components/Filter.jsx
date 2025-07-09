import React from 'react';

function Filter({ categories, sizes, onFilterChange }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="mb-4">
        <label className="block text-text-secondary mb-2">Category</label>
        <select
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="input"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-text-secondary mb-2">Size</label>
        <select
          onChange={(e) => onFilterChange('size', e.target.value)}
          className="input"
          aria-label="Filter by size"
        >
          <option value="">All Sizes</option>
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-text-secondary mb-2">Price Range</label>
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => onFilterChange('minPrice', e.target.value)}
          className="input mb-2"
          aria-label="Minimum price"
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="input"
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}

export default Filter;