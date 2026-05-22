import { createContext, useContext, useState, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0, count: 0 });
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartService.getCart();
      setCart(data);
    } catch {
      setCart({ items: [], total: 0, count: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartService.addToCart({ productId, quantity });
      await fetchCart();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateItem = async (id, quantity) => {
    try {
      await cartService.updateCartItem(id, quantity);
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const removeItem = async (id) => {
    try {
      await cartService.removeFromCart(id);
      await fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Remove failed');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addItem, updateItem, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
