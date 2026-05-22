import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../components/Loader';

const WishlistContent = () => {
  const { wishlist, loadUser, loading } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      {!wishlist?.length ? (
        <div className="card mt-8 p-12 text-center">
          <p className="text-gray-500">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary mt-4 inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const WishlistPage = () => (
  <ProtectedRoute>
    <WishlistContent />
  </ProtectedRoute>
);

export default WishlistPage;
