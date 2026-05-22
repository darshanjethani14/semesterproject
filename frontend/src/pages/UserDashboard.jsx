import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiHeart, FiUser } from 'react-icons/fi';
import { getUserOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { ORDER_STATUS } from '../utils/constants';
import Loader from '../components/Loader';
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardContent = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getUserOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="mt-2 text-gray-500">Welcome back, {user?.name}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FiUser, label: 'Account', value: user?.email },
            { icon: FiPackage, label: 'Total Orders', value: orders.length },
            { icon: FiHeart, label: 'Wishlist', value: user?.wishlist?.length || 0, link: '/wishlist' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <stat.icon className="text-brand-600" size={24} />
              <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
              {stat.link ? (
                <Link to={stat.link} className="text-xl font-bold hover:text-brand-600">{stat.value}</Link>
              ) : (
                <p className="text-xl font-bold truncate">{stat.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Order History</h2>
          {loading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <div className="card mt-4 p-8 text-center text-gray-500">
              <p>No orders yet</p>
              <Link to="/products" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((order) => {
                const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                return (
                  <div key={order._id} className="card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                      <p className="font-bold text-brand-600">${order.totalPrice?.toFixed(2)}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.products?.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                          <img src={item.image} alt="" className="h-10 w-10 rounded object-cover" />
                          <span className="text-sm">{item.title} x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const UserDashboard = () => (
  <ProtectedRoute>
    <DashboardContent />
  </ProtectedRoute>
);

export default UserDashboard;
