import { useSelector } from 'react-redux';
import { ProductCard } from './ProductCard';

export function ProductCarousel() {
  const { items } = useSelector(state => state.products);

  // Take a subset as "featured" products (first 10)
  const featured = items.slice(0, 10);

  if (featured.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Featured Products
        </h2>
        <p className="text-sm text-gray-500">
          Swipe horizontally to explore more
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {featured.map(product => (
            <div
              key={product.id}
              className="min-w-[220px] max-w-xs snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

