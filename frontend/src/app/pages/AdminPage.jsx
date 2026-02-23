import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { fetchUserThunk } from '../store/slices/authSlice';
import { fetchProductsThunk } from '../store/slices/productsSlice';
import {
  Settings,
  Users,
  Package,
  ShoppingBag,
  Wallet,
  Shield,
  Save,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState({ joiningBonusAmount: 2000 });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [adminOrders, setAdminOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [walletValue, setWalletValue] = useState('');
  const [editingOrderStatus, setEditingOrderStatus] = useState(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserThunk());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'settings') {
      setSettingsLoading(true);
      api
        .get('/admin/settings')
        .then(({ data }) => setSettings({ joiningBonusAmount: data.joiningBonusAmount ?? 2000 }))
        .catch(() => toast.error('Failed to load settings'))
        .finally(() => setSettingsLoading(false));
    }
    if (activeTab === 'users') {
      setUsersLoading(true);
      api
        .get('/admin/users')
        .then(({ data }) => setUsers(data))
        .catch(() => toast.error('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
    if (activeTab === 'orders') {
      setOrdersLoading(true);
      api
        .get('/admin/orders')
        .then(({ data }) => setAdminOrders(data))
        .catch(() => toast.error('Failed to load orders'))
        .finally(() => setOrdersLoading(false));
    }
    if (activeTab === 'products') {
      dispatch(fetchProductsThunk());
    }
  }, [isAdmin, activeTab, dispatch]);

  const handleSaveSettings = () => {
    setSettingsLoading(true);
    api
      .put('/admin/settings', { joiningBonusAmount: Number(settings.joiningBonusAmount) })
      .then(() => toast.success('Settings saved'))
      .catch(() => toast.error('Failed to save settings'))
      .finally(() => setSettingsLoading(false));
  };

  const handleSaveWallet = (userId) => {
    const value = Number(walletValue);
    if (isNaN(value) || value < 0) {
      toast.error('Invalid amount');
      return;
    }
    api
      .put(`/admin/users/${userId}/wallet`, { walletBalance: value })
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, walletBalance: value } : u))
        );
        setEditingWallet(null);
        setWalletValue('');
        toast.success('Wallet updated');
      })
      .catch(() => toast.error('Failed to update wallet'));
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    api
      .patch(`/admin/orders/${orderId}/status`, { status })
      .then(() => {
        setAdminOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        setEditingOrderStatus(null);
        toast.success('Order status updated');
      })
      .catch(() => toast.error('Failed to update status'));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Admin access required</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users & Wallet', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield className="w-8 h-8 text-green-600" />
          Admin Panel
        </h1>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition ${
                activeTab === id
                  ? 'border-green-600 text-green-700 bg-white font-medium'
                  : 'border-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Bonus (₹) – for new signups
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={settings.joiningBonusAmount}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, joiningBonusAmount: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsLoading}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-70"
                >
                  {settingsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Users & Wallet Control</h2>
              {usersLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 font-medium">Name</th>
                        <th className="py-2 font-medium">Email</th>
                        <th className="py-2 font-medium">Role</th>
                        <th className="py-2 font-medium">Wallet (₹)</th>
                        <th className="py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-gray-100">
                          <td className="py-3">{u.name}</td>
                          <td className="py-3">{u.email}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3">
                            {editingWallet === u._id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={walletValue}
                                  onChange={(e) => setWalletValue(e.target.value)}
                                  className="w-24 px-2 py-1 border rounded"
                                />
                                <button
                                  onClick={() => handleSaveWallet(u._id)}
                                  className="text-green-600 text-sm font-medium"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingWallet(null);
                                    setWalletValue('');
                                  }}
                                  className="text-gray-500 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="font-medium">₹{u.walletBalance ?? 0}</span>
                            )}
                          </td>
                          <td className="py-3">
                            {editingWallet !== u._id && u.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  setEditingWallet(u._id);
                                  setWalletValue(String(u.walletBalance ?? 0));
                                }}
                                className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                              >
                                <Wallet className="w-4 h-4" /> Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Orders</h2>
              {ordersLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                </div>
              ) : (
                <div className="space-y-4">
                  {adminOrders.map((o) => (
                    <div
                      key={o._id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium">Order #{o._id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {o.user?.name} – {o.user?.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {o.items?.length} items · ₹{o.totalAmount} · {o.paymentMethod}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingOrderStatus === o._id ? (
                          <>
                            {['pending', 'confirmed', 'delivered', 'cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateOrderStatus(o._id, status)}
                                className="px-3 py-1 rounded text-sm bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                {status}
                              </button>
                            ))}
                            <button
                              onClick={() => setEditingOrderStatus(null)}
                              className="text-gray-500 text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                o.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : o.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {o.status}
                            </span>
                            <button
                              onClick={() => setEditingOrderStatus(o._id)}
                              className="text-green-600 text-sm font-medium"
                            >
                              Change
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Products (from store)</h2>
              <p className="text-gray-600 mb-4">
                Products are loaded from the API. Add/Edit/Delete via API or extend this panel with forms.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-600">₹{p.price} · {p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
