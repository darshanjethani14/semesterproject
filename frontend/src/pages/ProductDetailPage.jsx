import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { getProduct } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { isAuthenticated, toggleWishlistItem, isInWishlist } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-xl text-gray-500">Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-flex">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    await toggleWishlistItem(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = () => addItem(product._id, qty);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700">
        <FiArrowLeft /> Back to products
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-8 lg:grid-cols-2"
      >
        <div className="card overflow-hidden">
          <img src={product.image} alt={product.title} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <span className="text-sm font-medium uppercase text-brand-600">{product.category}</span>
          <h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < Math.round(product.rating) ? 'fill-current' : ''} />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-brand-600">${product.price?.toFixed(2)}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{product.description}</p>
          <p className="mt-2 text-sm">
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </p>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center rounded-lg border dark:border-gray-600">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >−</button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >+</button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex items-center gap-2"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`btn-secondary flex items-center gap-2 ${inWishlist ? 'text-red-500' : ''}`}
            >
              <FiHeart className={inWishlist ? 'fill-current' : ''} />
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailPage;
