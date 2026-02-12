import { ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white">FRESH MART</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner for fresh groceries and daily essentials delivered to your doorstep.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-lg hover:bg-green-600 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4" >QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-green-400 transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-green-400 transition">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-green-400 transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">CATEGORIES</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Vegetables
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Fruits
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Dairy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Bakery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Beverages
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">CONTACT US</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+91 9014717283</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span>pendemsravan123@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                <span>123 Market Street, Suryapet District, Telangana State</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FreshMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

