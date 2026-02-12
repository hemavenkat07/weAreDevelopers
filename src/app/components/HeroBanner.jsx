import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg overflow-hidden mb-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 ">
            FRESH GROCERIES DELIVERED
          </h2>
          <p className="text-lg mb-6 text-green-50">
            Get farm-fresh vegetables, fruits, and daily essentials delivered to your doorstep in under 30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition font-semibold"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-600 transition font-semibold">
              View Offers
            </button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold">2000+</p>
              <p className="text-green-100 text-sm">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-green-100 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">30min</p>
              <p className="text-green-100 text-sm">Delivery</p>
            </div>
          </div>
        </div>
        <div className="hidden md:block h-full">
          <img
            src="https://images.unsplash.com/photo-1560096142-792fc2baab4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmclMjBiYW5uZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzA3MTY5ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fresh groceries"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

