import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { ORDER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FiRefreshCw, FiCheckCircle, FiClock, FiTruck, FiPackage } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const { data } = await getAllOrders();
      setOrders(data);
      toast.success(`📦 ${data.length} orders loaded`);
    } catch {
      setOrders([]);
      toast.error('Failed to load orders');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`✅ Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAcceptOrder = async (id) => {
    try {
      await updateOrderStatus(id, 'processing');
      toast.success('✅ Order accepted and moved to processing');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to accept order');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📦 Order Management</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">⏳ Pending Orders</p>
          <p className="text-3xl font-bold text-red-600">{pendingCount}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">⚙️ Processing</p>
          <p className="text-3xl font-bold text-blue-600">{processingCount}</p>
        </div>
        <div className="card p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">💰 Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex gap-2 flex-wrap">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize font-medium transition ${
              filter === status
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500 text-lg">No orders in this category</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
            const isPending = order.status === 'pending';
            
            return (
              <div
                key={order._id}
                className={`card p-5 border-l-4 transition ${
                  isPending ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                      {isPending && ' 🔴 PENDING'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      👤 {order.userId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      📧 {order.userId?.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      🕐 {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <p className="font-bold text-xl text-brand-600">
                      ${order.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="text-sm font-semibold mb-2">📦 Items ({order.products?.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {order.products?.map((item, i) => (
                      <span key={i} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
                        {item.title} <span className="font-bold">×{item.quantity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    <p className="font-semibold mb-1">📍 Shipping Address:</p>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>📞 {order.shippingAddress.phone}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-3 flex-wrap items-center">
                  {isPending && (
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                    >
                      <FiCheckCircle />
                      Accept Order
                    </button>
                  )}
                  
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="input-field flex-1 min-w-xs"
                  >
                    {Object.keys(ORDER_STATUS).map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS[s].label}</option>
                    ))}
                  </select>
                </div>

                {/* Status Timeline */}
                <div className="mt-3 flex gap-2 text-xs text-gray-600">
                  <span className={order.status === 'pending' || ['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}>✓ Pending</span>
                  <span>→</span>
                  <span className={order.status === 'processing' || ['shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}>✓ Processing</span>
                  <span>→</span>
                  <span className={order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}>✓ Shipped</span>
                  <span>→</span>
                  <span className={order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}>✓ Delivered</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
