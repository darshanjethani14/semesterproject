import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const CartPage = () => {
  const { cart, loading, fetchCart, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Please login to view your cart</p>
        <Link to="/login" className="btn-primary mt-6 inline-flex">Login</Link>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  if (!cart.items?.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <p className="mt-2 text-gray-500">{cart.count} items</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item._id} className="card flex gap-4 p-4">
              <img
                src={item.product?.image}
                alt={item.product?.title}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col sm:flex-row sm:justify-between">
                <div>
                  <Link to={`/products/${item.product?._id}`} className="font-semibold hover:text-brand-600">
                    {item.product?.title}
                  </Link>
                  <p className="text-brand-600 font-bold">${item.product?.price?.toFixed(2)}</p>
                </div>
                <div className="mt-2 flex items-center gap-4 sm:mt-0">
                  <div className="flex items-center rounded-lg border dark:border-gray-600">
                    <button
                      onClick={() => updateItem(item._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    ><FiMinus /></button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    ><FiPlus /></button>
                  </div>
                  <p className="font-semibold">${item.subtotal?.toFixed(2)}</p>
                  <button onClick={() => removeItem(item._id)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2 border-b pb-4 dark:border-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{cart.total >= 100 ? 'Free' : '$9.99'}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${(cart.total + (cart.total >= 100 ? 0 : 9.99)).toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 block w-full text-center">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
