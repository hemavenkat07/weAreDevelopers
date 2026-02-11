import { ShoppingCart, User, Search, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/slices/productsSlice';

export function Header() {
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(search));
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-green-600">FreshMart</span>
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Deliver to</span>
            <span className="font-semibold">Mumbai 400001</span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium">
                {isAuthenticated ? user?.name : 'Login'}
              </span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
