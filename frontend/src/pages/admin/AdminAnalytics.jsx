import { useEffect, useState } from 'react';
import { getOrderAnalytics } from '../../services/orderService';
import { ORDER_STATUS } from '../../utils/constants';
import Loader from '../../components/Loader';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await getOrderAnalytics();
        setData(res);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!data) return <p>Failed to load analytics</p>;

  const maxStatus = Math.max(...Object.values(data.statusCounts || {}), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <p className="text-gray-500">Store performance insights</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-1 text-4xl font-bold text-green-600">${data.totalRevenue?.toFixed(2)}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-4xl font-bold text-brand-600">{data.totalOrders}</p>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h2 className="font-semibold">Orders by Status</h2>
        <div className="mt-6 space-y-4">
          {Object.entries(data.statusCounts || {}).map(([status, count]) => {
            const info = ORDER_STATUS[status] || { label: status, color: 'bg-gray-100' };
            const pct = (count / maxStatus) * 100;
            return (
              <div key={status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="capitalize font-medium">{info.label}</span>
                  <span>{count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(ORDER_STATUS).map(([key, val]) => (
          <div key={key} className="card p-4 text-center">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${val.color}`}>
              {val.label}
            </span>
            <p className="mt-2 text-2xl font-bold">{data.statusCounts?.[key] || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
