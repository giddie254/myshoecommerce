// src/components/CartItem.jsx
import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeItem({ productId: item._id, size: item.size }));
  };

  const increaseQty = () => {
    if (item.quantity < item.countInStock) {
      dispatch(
        updateQuantity({
          productId: item._id,
          size: item.size,
          quantity: item.quantity + 1,
        })
      );
    }
  };

  const decreaseQty = () => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          productId: item._id,
          size: item.size,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  return (
    <div className="flex gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <img
        src={item.images?.[0] || '/images/placeholder.png'}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-text-primary dark:text-white">
          {item.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Size: {item.size}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={decreaseQty}
            className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm">{item.quantity}</span>
          <button
            onClick={increaseQty}
            className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            disabled={item.quantity >= item.countInStock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <p className="text-primary font-semibold mt-2">
          KSh {(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-500 transition"
        title="Remove from cart"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;

