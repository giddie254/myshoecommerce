// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error('Please provide a rating and comment');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Review submitted!');
      setComment('');
      setRating(0);
      if (onReviewAdded) onReviewAdded(data.review);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-sm text-yellow-800">
        Please <a href="/auth" className="underline text-primary">log in</a> to leave a review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded shadow space-y-4 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      {/* Star Rating UI */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            type="button"
            key={num}
            onClick={() => setRating(num)}
            className={`text-2xl ${rating >= num ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
        placeholder="Write your review..."
        rows={4}
        required
      />

      <button
        type="submit"
        className="btn-primary px-5 py-2 text-sm"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
