import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(`/api/products/search?q=${encodeURIComponent(query)}`);
        setProducts(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-h1 mb-4">Search Results for: <span className="text-primary">"{query}"</span></h1>

      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : products.length === 0 ? (
        <p className="text-red-500">No products found for <strong>{query}</strong>.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Back to Shop Link */}
      <div className="mt-6 text-center">
        <Link to="/shop" className="text-primary hover:underline text-sm">
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default SearchResultsPage;

