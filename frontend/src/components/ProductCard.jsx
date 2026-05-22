import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { isAuthenticated, toggleWishlistItem, isInWishlist } = useAuth();
  const { addItem } = useCart();
  const inWishlist = isInWishlist(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    await toggleWishlistItem(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product._id);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group card overflow-hidden"
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-bold text-white">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
              Out of Stock
            </span>
          )}
          <button
            onClick={handleWishlist}
            className={`absolute right-2 top-2 rounded-full p-2 shadow transition ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white dark:bg-gray-800/90'
            }`}
          >
            <FiHeart className={inWishlist ? 'fill-current' : ''} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900 dark:text-white">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
            <FiStar className="fill-current" />
            <span>{product.rating?.toFixed(1) || '4.5'}</span>
            <span className="text-gray-400">({product.numReviews || 0})</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price?.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              <FiShoppingCart />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
