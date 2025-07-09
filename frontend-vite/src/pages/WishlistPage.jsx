import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Use optional chaining and fallback to empty array
        const fetchedWishlist = res.data?.wishlist ?? [];
        setWishlist(fetchedWishlist);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        setWishlist([]); // fallback to avoid undefined
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading your wishlist...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 mb-4">Your Wishlist</h1>
      {Array.isArray(wishlist) && wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <li key={product._id} className="card">
              <img
                src={product.images?.[0] ?? '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-card mb-2"
              />
              <h2 className="text-h2 mb-1">{product.name}</h2>
              <p className="text-body">KSh {product.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;

