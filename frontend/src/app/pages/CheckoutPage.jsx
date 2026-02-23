import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrderThunk } from '../store/slices/ordersSlice';
import { fetchUserThunk } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';
import { Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

export function CheckoutPage() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { placeOrderLoading, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
  });

  const walletBalance = user?.walletBalance ?? 0;
  const canPayWithWallet = walletBalance >= totalPrice;

  const [redirecting, setRedirecting] = useState(false);
  useEffect(() => {
    if (items.length === 0 && !redirecting) {
      setRedirecting(true);
      navigate('/cart', { replace: true });
      return;
    }
    if (!isAuthenticated && !redirecting) {
      setRedirecting(true);
      navigate('/login', { replace: true });
      return;
    }
  }, [items.length, isAuthenticated, navigate, redirecting]);

  useEffect(() => {
    if (user?.name) setFormData((prev) => ({ ...prev, name: user.name }));
    if (user?.phone) setFormData((prev) => ({ ...prev, phone: user.phone }));
  }, [user?.name, user?.phone]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!canPayWithWallet) {
      toast.error('Insufficient wallet balance. Refill your wallet from Profile.');
      return;
    }

    const deliveryAddress = `${formData.address}, ${formData.city}, ${formData.pincode}`;
    const payload = {
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      totalAmount: totalPrice,
      deliveryAddress,
      paymentMethod: 'wallet',
    };

    const result = await dispatch(placeOrderThunk(payload));
    if (placeOrderThunk.fulfilled.match(result)) {
      dispatch(clearCart());
      dispatch(fetchUserThunk());
      toast.success('Order placed successfully!');
      navigate('/orders');
    }
  };

  if (redirecting || (items.length === 0 && !redirecting) || (!isAuthenticated && !redirecting)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <p className="text-sm text-gray-600 mb-4">Add your delivery address below.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Street, area, landmark"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Payment – Wallet</h2>
                <div className="flex items-center gap-3 p-4 border-2 border-green-600 bg-green-50 rounded-lg">
                  <Banknote className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Pay with Wallet</p>
                    <p className="text-sm text-gray-600">
                      Balance: <span className="font-semibold text-gray-900">₹{walletBalance}</span>
                      {totalPrice > 0 && (
                        <span className="ml-2">
                          {canPayWithWallet ? (
                            <span className="text-green-600">✓ Enough for this order (₹{totalPrice})</span>
                          ) : (
                            <span className="text-red-600">Need ₹{totalPrice}</span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {!canPayWithWallet && totalPrice > 0 && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 mb-2">Insufficient balance. Refill your wallet to place the order.</p>
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      Refill wallet →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalPrice}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={placeOrderLoading || !canPayWithWallet}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {placeOrderLoading ? 'Placing order...' : 'Pay with wallet & place order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
