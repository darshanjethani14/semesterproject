import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiHeart,
  FiSearch,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { cart, fetchCart } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white">
              S
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Semes<span className="text-brand-600">Shop</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pl-10"
              />
            </div>
          </form>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-600 transition hover:text-brand-600 dark:text-gray-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:block"
              >
                <FiHeart size={20} />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiShoppingCart size={20} />
              {cart.count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {cart.count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiUser />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary hidden text-sm md:inline-flex">
                Login
              </Link>
            )}

            <button
              className="rounded-lg p-2 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field"
                />
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    Wishlist
                  </Link>
                  <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-gray-100">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-gray-100">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
