import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ limit: 8, sort: '-rating' });
        setFeatured(data.products);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              New Season Collection 2026
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Premium Products at Unbeatable Prices
            </h1>
            <p className="mt-6 text-lg text-brand-100">
              Shop the latest trends in electronics, fashion, sports, and more. Free shipping on orders over $100.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products?category=Electronics" className="inline-flex items-center gap-2 rounded-lg border-2 border-white/50 px-6 py-3 font-semibold transition hover:bg-white/10">
                Browse Electronics
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: FiShield, title: 'Secure Payment', desc: '100% protected checkout' },
            { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/50">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View All →
          </Link>
        </div>
        <div className="mt-8">
          {loading ? (
            <ProductSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-100 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold">Shop by Category</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {['Electronics', 'Fashion', 'Sports', 'Beauty', 'Home'].map((cat, i) => (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.03 }}
                className="card cursor-pointer overflow-hidden text-center"
              >
                <Link to={`/products?category=${cat}`} className="block p-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600 dark:bg-brand-900/50">
                    {cat[0]}
                  </div>
                  <p className="mt-3 font-semibold">{cat}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
