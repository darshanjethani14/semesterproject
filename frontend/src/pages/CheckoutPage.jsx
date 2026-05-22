import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import ProtectedRoute from '../components/ProtectedRoute';

const CheckoutForm = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const shipping = cart.total >= 100 ? 0 : 9.99;
  const total = cart.total + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.items?.length) {
      toast.error('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      await createOrder({
        shippingAddress: form,
        paymentMethod: form.paymentMethod,
      });
      toast.success('Order placed successfully!');
      await fetchCart();
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items?.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-xl">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          {['fullName', 'address', 'city', 'postalCode', 'country', 'phone'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                required
                type="text"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="input-field mt-1"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="input-field mt-1"
            >
              <option value="card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <div className="card h-fit p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <ul className="mt-4 space-y-2">
            {cart.items.map((item) => (
              <li key={item._id} className="flex justify-between text-sm">
                <span>{item.product?.title} x{item.quantity}</span>
                <span>${item.subtotal?.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-4 dark:border-gray-700">
            <div className="flex justify-between"><span>Subtotal</span><span>${cart.total?.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="mt-2 flex justify-between text-lg font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

const CheckoutPage = () => (
  <ProtectedRoute>
    <CheckoutForm />
  </ProtectedRoute>
);

export default CheckoutPage;
