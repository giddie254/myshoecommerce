import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

const OrderDetails = () => {
  const { id } = useParams();

  // Mock order data (replace with real API later)
  const order = {
    _id: id,
    status: 'Delivered',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Jane Doe',
      email: 'jane@example.com',
    },
    shippingAddress: {
      address: '456 Main St',
      city: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
    },
    paymentMethod: 'MPESA',
    totalPrice: 5400,
    items: [
      {
        _id: 'p1',
        name: 'Nike ZoomX',
        size: '42',
        price: 2700,
        quantity: 2,
        image: '/images/shoe1.jpg',
      },
    ],
  };

  const statusColor = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-h1">Order #{order._id.slice(-6).toUpperCase()}</h1>
        <Link to="/admin/orders" className="text-sm text-primary hover:underline">
          ← Back to Orders
        </Link>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <p><strong>Name:</strong> {order.user.name}</p>
          <p><strong>Email:</strong> {order.user.email}</p>
        </div>
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">Shipping</h2>
          <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`inline-block px-2 py-1 text-xs rounded ${statusColor[order.status]}`}>
            {order.status}
          </span>
        </p>
        <p><strong>Placed on:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total:</strong> {formatCurrency(order.totalPrice)}</p>
      </div>

      {/* Product Items */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">Ordered Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Size</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id} className="border-t text-sm">
                  <td className="p-2 flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    {item.name}
                  </td>
                  <td className="p-2">{item.size}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{formatCurrency(item.price)}</td>
                  <td className="p-2 font-medium">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
