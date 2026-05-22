import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { getOrderAnalytics } from '../../services/orderService';
import { getProducts } from '../../services/productService';
import { getUsers } from '../../services/authService';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [analytics, products, users] = await Promise.all([
          getOrderAnalytics(),
          getProducts({ limit: 1 }),
          getUsers(),
        ]);
        setStats({
          revenue: analytics.data.totalRevenue,
          orders: analytics.data.totalOrders,
          products: products.data.total,
          users: users.data.length,
          recent: analytics.data.recentOrders,
          pending: analytics.data.statusCounts?.pending || 0,
          processing: analytics.data.statusCounts?.processing || 0,
        });
      } catch {
        setStats({ revenue: 0, orders: 0, products: 0, users: 0, recent: [], pending: 0, processing: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader fullScreen />;

  const cards = [
    { icon: FiDollarSign, label: 'Total Revenue', value: `$${stats.revenue?.toFixed(2)}`, color: 'bg-green-500' },
    { icon: FiShoppingBag, label: 'Total Orders', value: stats.orders, color: 'bg-blue-500', link: '/admin/orders' },
    { icon: FiPackage, label: 'Products', value: stats.products, color: 'bg-purple-500', link: '/admin/products' },
    { icon: FiUsers, label: 'Users', value: stats.users, color: 'bg-amber-500', link: '/admin/users' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">👑 Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome! Manage your e-commerce store</p>
        </div>
      </div>

      {/* Alert for Pending Orders */}
      {stats.pending > 0 && (
        <div className="mt-6 bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-red-600 text-2xl" />
            <div className="flex-1">
              <p className="font-bold text-red-700">🔴 {stats.pending} Pending Order{stats.pending > 1 ? 's' : ''}</p>
              <p className="text-sm text-red-600">Click below to review and accept orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold whitespace-nowrap"
            >
              Review Now →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`card p-5 transition cursor-pointer hover:shadow-lg ${card.link ? 'hover:border-brand-600' : ''}`}
          >
            <div className={`inline-flex rounded-lg p-3 text-white ${card.color}`}>
              <card.icon size={24} />
            </div>
            <p className="mt-3 text-sm text-gray-500">{card.label}</p>
            {card.link ? (
              <Link to={card.link} className="text-2xl font-bold hover:text-brand-600 block mt-2">
                {card.value}
              </Link>
            ) : (
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link to="/admin/orders" className="card p-4 border-l-4 border-red-500 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">⏳ Pending Orders</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.pending}</p>
        </Link>
        <Link to="/admin/orders" className="card p-4 border-l-4 border-blue-500 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">⚙️ Processing</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.processing}</p>
        </Link>
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">✅ Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.orders - stats.pending - stats.processing}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            📦 Recent Orders
            {stats.pending > 0 && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">{stats.pending}</span>}
          </h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        {!stats.recent?.length ? (
          <p className="mt-4 text-gray-500">No orders yet</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((o) => (
                  <tr key={o._id} className={`border-b dark:border-gray-800 ${o.status === 'pending' ? 'bg-red-50 dark:bg-red-950' : ''}`}>
                    <td className="py-3 pr-4 font-mono text-xs font-bold">{o._id.slice(-8)}</td>
                    <td className="py-3 pr-4">{o.userId?.name}</td>
                    <td className="py-3 pr-4 font-bold">${o.totalPrice?.toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        o.status === 'pending' ? 'bg-red-200 text-red-800' :
                        o.status === 'processing' ? 'bg-blue-200 text-blue-800' :
                        o.status === 'shipped' ? 'bg-yellow-200 text-yellow-800' :
                        o.status === 'delivered' ? 'bg-green-200 text-green-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
