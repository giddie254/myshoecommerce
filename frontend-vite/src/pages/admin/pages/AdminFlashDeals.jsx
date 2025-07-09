import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../../utils/formatCurrency'; // fixed path

const AdminFlashDeals = () => {
  const [flashDeals, setFlashDeals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [flashStart, setFlashStart] = useState('');
  const [flashEnd, setFlashEnd] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFlashDeals = async () => {
    try {
      const { data } = await axios.get('/api/products/flash');
      setFlashDeals(data || []);
    } catch (err) {
      toast.error('Failed to load flash deals');
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setAllProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const addFlashDeal = async () => {
    if (!selectedId || !flashStart || !flashEnd) {
      return toast.error('Please select product, start and end time');
    }

    try {
      setLoading(true);
      await axios.patch(`/api/products/${selectedId}`, {
        isFlashDeal: true,
        flashDealStart: flashStart,
        flashDealEnd: flashEnd,
      });
      toast.success('Flash deal added');
      setSelectedId('');
      setFlashStart('');
      setFlashEnd('');
      fetchFlashDeals();
    } catch (err) {
      toast.error('Failed to add flash deal');
    } finally {
      setLoading(false);
    }
  };

  const removeFlashDeal = async (id) => {
    try {
      await axios.patch(`/api/products/${id}`, { isFlashDeal: false });
      toast.success('Removed from flash deals');
      fetchFlashDeals();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  useEffect(() => {
    fetchFlashDeals();
    fetchAllProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Flash Deals</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        >
          <option value="">Select product to promote</option>
          {allProducts
            .filter((p) => !p.isFlashDeal)
            .map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
        </select>

        <input
          type="datetime-local"
          value={flashStart}
          onChange={(e) => setFlashStart(e.target.value)}
          className="p-2 border rounded"
        />

        <input
          type="datetime-local"
          value={flashEnd}
          onChange={(e) => setFlashEnd(e.target.value)}
          className="p-2 border rounded"
        />

        <button
          onClick={addFlashDeal}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Flash Deals'}
        </button>
      </div>

      {flashDeals.length === 0 ? (
        <p className="text-gray-500">No flash deals active.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {flashDeals.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-background-darkSecondary p-4 rounded shadow flex flex-col justify-between"
            >
              <img
                src={product.images?.[0] || '/images/placeholder.png'}
                alt={product.name}
                className="h-40 object-cover mb-3 rounded"
              />
              <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
              <p className="text-xs text-gray-400 mt-1">
                Ends: {new Date(product.flashDealEnd).toLocaleString()}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="flex items-center gap-1 text-yellow-500 text-xs">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {product.rating?.toFixed(1) || '4.5'}
                </span>
                <button
                  onClick={() => removeFlashDeal(product._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFlashDeals;
