import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => (
  <footer className="mt-auto border-t border-gray-200 bg-gray-900 text-gray-300 dark:border-gray-800">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="text-2xl font-bold text-white">
            Semes<span className="text-brand-400">Shop</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-gray-400">
            Your premium destination for quality products. Fast shipping, secure checkout, and exceptional customer service.
          </p>
          <div className="mt-4 flex gap-4">
            <a href="#" className="hover:text-white"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-white"><FiInstagram size={20} /></a>
            <a href="#" className="hover:text-white"><FiGithub size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?category=Electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-white">Fashion</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Account</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">My Orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Semes Shop. MERN Stack E-Commerce FYP Project.
      </div>
    </div>
  </footer>
);

export default Footer;
