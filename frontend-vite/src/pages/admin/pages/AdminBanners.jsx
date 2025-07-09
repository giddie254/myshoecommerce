import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, RefreshCw, EyeOff, Eye } from 'lucide-react';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get('/api/admin/banners');
      setBanners(data);
    } catch (err) {
      console.error('Failed to fetch banners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('link', link);

    try {
      await axios.post('/api/admin/banners', formData);
      fetchBanners();
      setFile(null);
      setLink('');
    } catch (err) {
      alert('Failed to upload banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await axios.delete(`/api/admin/banners/${id}`);
        fetchBanners();
      } catch {
        alert('Delete failed');
      }
    }
  };

  const toggleBannerStatus = async (id) => {
    try {
      await axios.put(`/api/admin/banners/${id}/toggle`);
      fetchBanners();
    } catch {
      alert('Status update failed');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">Banner Manager</h1>
        <Button onClick={fetchBanners} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4">
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        <input
          type="url"
          placeholder="Optional redirect link (e.g. https://sokohive.com/sale)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="input flex-1"
        />
        <Button type="submit" size="sm">
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
      </form>

      {/* Banner List */}
      {loading ? (
        <p className="text-gray-500">Loading banners...</p>
      ) : banners.length === 0 ? (
        <p className="text-gray-500">No banners found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="rounded-lg border overflow-hidden shadow bg-white dark:bg-gray-800"
            >
              <img src={banner.image} alt="Banner" className="w-full h-32 object-cover" />
              <div className="p-3 space-y-1">
                <p className="text-xs text-gray-500 truncate">{banner.link || 'No link'}</p>
                <div className="flex items-center justify-between mt-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleBannerStatus(banner._id)}
                  >
                    {banner.isActive ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(banner._id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
