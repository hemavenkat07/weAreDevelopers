import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/slices/productsSlice';

export function CategoryFilter() {
  const dispatch = useDispatch();
  const { categories, selectedCategory } = useSelector(state => state.products);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="font-semibold text-lg mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => dispatch(setCategory(category))}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

