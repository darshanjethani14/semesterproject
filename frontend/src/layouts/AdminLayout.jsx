import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiHome,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { to: '/admin', label: 'Overview', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <div className="sticky top-16 p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Admin Panel
          </p>
          <nav className="space-y-1">
            {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(to, end)
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <Link
              to="/"
              className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiHome size={18} />
              Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-800"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
