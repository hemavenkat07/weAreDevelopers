import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchUserThunk, updateProfileThunk, refillWalletThunk } from '../store/slices/authSlice';
import { fetchOrdersThunk } from '../store/slices/ordersSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Package, LogOut, ShoppingBag, Clock, Wallet, Edit2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { StatsCard } from '../components/StatsCard';

export function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [refilling, setRefilling] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserThunk());
      dispatch(fetchOrdersThunk());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfileThunk(formData));
    if (updateProfileThunk.fulfilled.match(result)) {
      toast.success('Profile updated');
      setEditing(false);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  const handleRefillWallet = async () => {
    setRefilling(true);
    const result = await dispatch(refillWalletThunk());
    if (refillWalletThunk.fulfilled.match(result)) {
      toast.success('₹500 added to wallet (dummy refill)');
    } else {
      toast.error(result.payload || 'Refill failed');
    }
    setRefilling(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Wallet Balance" value={`₹${user?.walletBalance ?? 0}`} icon={Wallet} color="green" />
          <StatsCard title="Total Orders" value={totalOrders} icon={ShoppingBag} color="blue" />
          <StatsCard title="Pending Orders" value={pendingOrders} icon={Clock} color="orange" />
          <StatsCard title="Total Spent" value={`₹${totalSpent}`} icon={Package} color="gray" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="profile-form"
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Your default address"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{user?.name || '–'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user?.email || '–'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{user?.phone || '–'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{user?.address || '–'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link
                    to="/"
                    className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <span className="text-green-600 font-semibold">₹{order.totalAmount}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item(s) • {order.status}
                      </p>
                    </div>
                  ))}
                  {orders.length > 3 && (
                    <Link
                      to="/orders"
                      className="block text-center text-green-600 hover:text-green-700 font-medium py-2"
                    >
                      View All Orders
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

              <button
                type="button"
                onClick={handleRefillWallet}
                disabled={refilling}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium"
              >
                <PlusCircle className="w-5 h-5" />
                {refilling ? 'Adding...' : 'Refill wallet (+₹500)'}
              </button>
              <p className="text-xs text-gray-500">Dummy refill for testing. Use when balance is low.</p>

              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-medium">My Orders</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-medium">Shopping Cart</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
