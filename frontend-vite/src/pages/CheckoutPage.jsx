import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const kenyaCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
  "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
  "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta",
  "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga",
  "Wajir", "West Pokot"
];

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [shippingOption, setShippingOption] = useState('standard');

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // 🚀 Future backend integration will go here
    alert('✅ Order placed! You’ll receive confirmation from SokoHive soon. Address will be saved to your profile.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-text-primary dark:text-white">
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" required placeholder="Full Name" className="input" />
              <input type="tel" required pattern="[0-9]{10}" placeholder="Phone Number (07XXXXXXXX)" className="input" />
              <select required className="input">
                <option value="">Select County</option>
                {kenyaCounties.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Town / Area Name"
                className="input"
                list="towns"
              />
              <datalist id="towns">
                <option value="Nairobi" />
                <option value="Mombasa" />
                <option value="Eldoret" />
                <option value="Kisumu" />
                <option value="Thika" />
                <option value="Bungoma" />
                <option value="Nakuru" />
                <option value="Machakos" />
              </datalist>
              <input type="text" required placeholder="Postal Code" className="input" />
              <input type="text" required placeholder="Street Address" className="input col-span-2" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Delivery Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingOption === 'standard'}
                  onChange={() => setShippingOption('standard')}
                  className="accent-primary"
                />
                Standard Delivery (3–5 days) — <span className="text-primary font-medium">KSh 250</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shippingOption === 'express'}
                  onChange={() => setShippingOption('express')}
                  className="accent-primary"
                />
                Express Delivery (1–2 days) — <span className="text-primary font-medium">KSh 500</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Order Summary</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {cartItems.map((item) => (
              <li key={item._id} className="py-2 flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>KSh {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shippingOption === 'express' ? 'KSh 500' : 'KSh 250'}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-3 mt-3">
              <span>Total:</span>
              <span>KSh {(subtotal + (shippingOption === 'express' ? 500 : 250)).toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6 py-2 font-semibold"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;


