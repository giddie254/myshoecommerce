// src/pages/admin/pages/AdminReviews.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Trash2, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`/api/admin/reviews/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (err) {
      toast.error('Toggle failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/admin/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchReviews();
        toast.success('Review deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-white">📝 Product Reviews</h1>
        <Button onClick={fetchReviews} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Reviewer</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Review</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-sm text-gray-500">No reviews found.</td></tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="border-b dark:border-gray-800">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.product?.images?.[0] || '/placeholder.png'}
                        alt={review.product?.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="font-medium text-sm truncate max-w-[140px]">
                        {review.product?.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-sm">{review.user?.name || 'Anonymous'}</td>
                  <td className="p-2">
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star key={i} size={16} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                  </td>
                  <td className="p-2 text-sm max-w-xs break-words whitespace-pre-wrap">
                    {review.comment}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        review.approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {review.approved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2 flex-wrap">
                    <Button
                      onClick={() => handleToggleStatus(review._id)}
                      variant="outline"
                      size="sm"
                    >
                      {review.approved ? 'Hide' : 'Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(review._id)}
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

export default AdminReviews;
