// src/components/ReviewList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/product/${productId}`);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  if (!reviews.length) return <p className="text-sm text-gray-500">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-sm">{review.name}</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-700">{review.comment}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

