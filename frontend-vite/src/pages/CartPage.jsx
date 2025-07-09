import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { applyCoupon, removeCoupon } from '../redux/slices/cartSlice';
import axios from 'axios';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const discount = useSelector((state) => state.cart.discount);
  const couponCode = useSelector((state) => state.cart.couponCode);

  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    setLoadingCoupon(true);
    setCouponStatus(null);

    try {
      const { data } = await axios.post('/api/coupons/validate', { code: coupon });
      dispatch(applyCoupon({
        code: data.code,
        discount: Math.round((data.discount / 100) * subtotal)
      }));
      setCouponStatus('success');
    } catch (err) {
      dispatch(removeCoupon());
      setCouponStatus('error');
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-white">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <img src="/images/empty-cart.svg" alt="Empty cart" className="w-64 h-64 mb-6" />
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            Your SokoHive cart is currently empty.
          </p>
          <Link to="/shop" className="btn-primary px-6 py-2 text-sm font-medium">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item, idx) => (
              <CartItem key={`${item._id}-${item.size}-${idx}`} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <aside className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-20 h-fit space-y-4">
            <h3 className="text-lg font-bold text-text-primary dark:text-white">Order Summary</h3>

            <div className="flex justify-between text-sm text-text-secondary dark:text-gray-400">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm text-text-secondary dark:text-gray-400">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            {/* Coupon Section */}
            <div className="pt-4">
              <label className="text-sm font-medium text-text-primary dark:text-white">
                Have a coupon?
              </label>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setCouponStatus(null);
                  }}
                  placeholder="Enter coupon code"
                  className="input w-full rounded-l-md text-sm"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={loadingCoupon || !coupon.trim()}
                  className="btn-primary px-4 rounded-r-md text-sm disabled:opacity-50"
                >
                  {loadingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {couponStatus === 'success' && (
                <p className="text-green-600 text-xs mt-1">
                  Coupon "<span className="font-semibold">{couponCode}</span>" applied. -KSh {discount}
                </p>
              )}
              {couponStatus === 'error' && (
                <p className="text-red-500 text-xs mt-1">Invalid or expired coupon code.</p>
              )}
            </div>

            {/* Discount Row */}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-text-secondary dark:text-gray-400">
                <span>Discount</span>
                <span className="text-green-600">-KSh {discount.toLocaleString()}</span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between font-semibold text-base border-t pt-4 text-text-primary dark:text-white">
              <span>Total</span>
              <span>KSh {total.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full mt-4 py-2 text-sm"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  );
};

export default CartPage;


