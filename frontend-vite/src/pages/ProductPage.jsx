// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';
import { updateWishlist } from '../redux/slices/authSlice';
import { HeartIcon } from '@heroicons/react/24/solid';
import { ChevronRight } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [tab, setTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setSelectedSize(data.sizes?.[0]?.size || '');
      setMainImage(data.images?.[0] || '');
      setReviews(data.reviews || []);
    };

    const fetchRelated = async () => {
      const { data } = await axios.get(`/api/products/related/${id}`);
      setRelatedProducts(data.products || []);
    };

    fetchProduct();
    fetchRelated();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addItem({ product, size: selectedSize, quantity: 1, price: product.price }));
  };

  const handleWishlist = async () => {
    if (!user) return;
    const isWished = user.wishlist?.some((item) => item._id === product._id);
    const method = isWished ? 'delete' : 'post';
    const { data } = await axios[method](
      `/api/auth/wishlist`,
      { productId: product._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(updateWishlist({ wishlist: data.wishlist }));
  };

  const handleNewReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  if (!product) return <div className="p-6 text-center text-gray-500">Loading product...</div>;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center">
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="font-medium text-text-primary">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col gap-2 overflow-auto max-h-80">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-16 h-16 object-cover border rounded cursor-pointer transition ${
                  mainImage === img ? 'border-primary' : 'border-gray-300'
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-lg shadow-md hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">{product.name}</h1>
          <p className="text-sm text-text-secondary mb-2">Brand: {product.brand}</p>
          <p className="text-2xl font-semibold text-primary mb-4">KSh {product.price.toLocaleString()}</p>

          {/* Sizes */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Choose Size:</label>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  onClick={() => sizeObj.stock > 0 && setSelectedSize(sizeObj.size)}
                  className={`border px-4 py-1.5 rounded-full transition ${
                    selectedSize === sizeObj.size ? 'bg-primary text-white' : 'bg-gray-100'
                  } ${sizeObj.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={sizeObj.stock === 0}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="btn-primary px-6 py-2 text-sm"
              disabled={product.stock === 0 || selectedSize === ''}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {user && (
              <button
                onClick={handleWishlist}
                className="p-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <HeartIcon
                  className={`w-5 h-5 ${
                    user.wishlist?.some((item) => item._id === product._id)
                      ? 'text-secondary'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex border-b border-gray-300 mb-4 space-x-4">
          <button
            onClick={() => setTab('description')}
            className={`pb-2 text-sm font-medium ${
              tab === 'description' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setTab('specs')}
            className={`pb-2 text-sm font-medium ${
              tab === 'specs' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'
            }`}
          >
            Specifications
          </button>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {tab === 'description' && <p>{product.description}</p>}
          {tab === 'specs' && (
            <ul className="list-disc list-inside space-y-1">
              <li>Material: {product.material || 'N/A'}</li>
              <li>Color: {product.color || 'N/A'}</li>
              <li>Category: {product.category || 'N/A'}</li>
              <li>Stock: {product.stock}</li>
            </ul>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review, idx) => (
              <li key={idx} className="border rounded p-4 shadow-sm bg-white dark:bg-background-darkSecondary">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm text-text-primary">{review.user?.name || 'Anonymous'}</p>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-yellow-500 text-sm mb-1">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
        {user && <ReviewForm productId={product._id} onReviewAdded={handleNewReview} />}
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">You may also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
