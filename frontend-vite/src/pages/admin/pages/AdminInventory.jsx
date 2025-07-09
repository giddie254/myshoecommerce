// src/pages/admin/pages/AdminInventory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Warehouse, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get('/api/admin/products');
      setProducts(data);
    } catch (err) {
      console.error('Error loading inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id, value) => {
    setEditingStock({ ...editingStock, [id]: value });
  };

  const saveStock = async (id) => {
    const quantity = editingStock[id];
    try {
      await axios.put(`/api/admin/products/${id}/stock`, { quantity });
      fetchInventory();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Inventory Management</h1>
        <Button onClick={fetchInventory} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center">No products found.</td></tr>
            ) : (
              products.map((product) => {
                const stockValue = editingStock[product._id] ?? product.countInStock;
                const isLowStock = stockValue <= 5;
                return (
                  <tr key={product._id} className="border-b dark:border-gray-700">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      {product.name}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={stockValue}
                        onChange={(e) => handleStockChange(product._id, Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded dark:bg-gray-800"
                      />
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        stockValue === 0 ? 'bg-red-100 text-red-600' : isLowStock ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'
                      }`}>
                        {stockValue === 0 ? 'Out of Stock' : stockValue <= 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button size="sm" onClick={() => saveStock(product._id)}>
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
