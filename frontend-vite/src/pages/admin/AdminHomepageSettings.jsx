// src/pages/admin/AdminHomepageSettings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminHomepageSettings = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    showFeaturedProducts: true,
    showFlashDeals: true,
    showTestimonials: true,
    showCategories: true,
    showCouponBanner: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/admin/settings/homepage');
        setForm({
          showFeaturedProducts: data.showFeaturedProducts,
          showFlashDeals: data.showFlashDeals,
          showTestimonials: data.showTestimonials,
          showCategories: data.showCategories,
          showCouponBanner: data.showCouponBanner,
        });
      } catch (err) {
        toast.error('Failed to load homepage settings');
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/admin/settings/homepage', form);
      toast.success('Homepage settings updated');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-background-dark rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-primary">Homepage Sections</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <label className="capitalize text-sm text-text-primary dark:text-white">
              {key.replace(/show/, '').replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="checkbox"
              name={key}
              checked={form[key]}
              onChange={handleChange}
              className="h-5 w-5"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-4 w-full"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminHomepageSettings;
