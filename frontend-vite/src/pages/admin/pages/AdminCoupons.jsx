// src/pages/admin/pages/AdminCoupons.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    usageLimit: '',
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/api/admin/coupons');
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/coupons', formData);
      fetchCoupons();
      setShowForm(false);
      setFormData({ code: '', discount: '', expiryDate: '', usageLimit: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`/api/admin/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (err) {
      alert('Toggle failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/admin/coupons/${id}`);
        fetchCoupons();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Manage Coupons</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Coupon
          </Button>
          <Button onClick={fetchCoupons} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
          <input
            required
            type="text"
            placeholder="Coupon Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="input"
          />
          <input
            required
            type="number"
            placeholder="Discount %"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            className="input"
          />
          <input
            required
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            className="input"
          />
          <input
            required
            type="number"
            placeholder="Usage Limit"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            className="input"
          />
          <Button type="submit" className="col-span-1 md:col-span-4 w-full">
            Create Coupon
          </Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Discount</th>
              <th className="p-2">Usage</th>
              <th className="p-2">Expires</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center">No coupons yet.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c._id} className="border-b dark:border-gray-800">
                  <td className="p-2 font-medium">{c.code}</td>
                  <td className="p-2">{c.discount}%</td>
                  <td className="p-2">{c.usageLimit}</td>
                  <td className="p-2">{format(new Date(c.expiryDate), 'PP')}</td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => toggleStatus(c._id)}
                      variant="outline"
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(c._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
