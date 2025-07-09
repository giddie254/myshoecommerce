// src/pages/admin/pages/ProductsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
  StarIcon,
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProductsList = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?page=${page}&limit=10`);
      setProducts(data.products || []);
      setPages(data.pages);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await axios.put(
        `/api/products/${product._id}`,
        { isFeatured: !product.isFeatured },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to update featured status');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Products</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name"
            className="input flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary px-4 py-2 flex items-center">
            <SearchIcon className="w-4 h-4" />
          </button>
          <Link to="/admin/products/new" className="btn-primary px-4 py-2 flex items-center gap-1">
            <PlusIcon className="w-4 h-4" />
            New Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading products...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Brand</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price (KSh)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Featured</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.brand}</td>
                      <td className="px-4 py-3 capitalize">{product.category}</td>
                      <td className="px-4 py-3">KSh {product.price.toLocaleString()}</td>
                      <td className="px-4 py-3">{product.countInStock}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`text-sm flex items-center gap-1 ${
                            product.isFeatured ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                        >
                          <StarIcon className="w-4 h-4" />
                          {product.isFeatured ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                          className="text-primary hover:underline text-sm flex items-center gap-1"
                        >
                          <EditIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="text-red-600 hover:underline text-sm flex items-center gap-1"
                        >
                          <Trash2Icon className="w-4 h-4" />
                          {deletingId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`px-3 py-1 rounded-md border ${
                  page === x + 1 ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700'
                }`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsList;


