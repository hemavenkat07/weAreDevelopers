import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Package, LogOut, ShoppingBag, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { StatsCard } from '../components/StatsCard';

export function ProfilePage() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { orders } = useSelector(state => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Total Orders" value={totalOrders} icon={ShoppingBag} color="green" />
          <StatsCard title="Pending Orders" value={pendingOrders} icon={Clock} color="orange" />
          <StatsCard title="Total Spent" value={`₹${totalSpent}`} icon={Package} color="blue" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                </div>

                {user?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>
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
                  {orders.slice(0, 3).map(order => (
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
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
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
    </div>
  );
}

