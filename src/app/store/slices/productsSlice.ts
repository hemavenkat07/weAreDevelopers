import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
  rating: number;
  reviews: number;
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Fresh red tomatoes, locally sourced',
    price: 40,
    originalPrice: 60,
    image: 'https://images.unsplash.com/photo-1714224247661-ee250f55a842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc3MDYxNTA4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Vegetables',
    unit: '1 kg',
    stock: 50,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Organic Apples',
    description: 'Sweet and crispy organic apples',
    price: 180,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdHMlMjBvcmdhbmljJTIwbWFya2V0fGVufDF8fHx8MTc3MDcxNjY3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fruits',
    unit: '1 kg',
    stock: 30,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '3',
    name: 'Fresh Milk',
    description: 'Full cream fresh milk',
    price: 60,
    image: 'https://images.unsplash.com/photo-1635714293982-65445548ac42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzA2MTYyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Dairy',
    unit: '1 L',
    stock: 40,
    rating: 4.6,
    reviews: 203,
  },
  {
    id: '4',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread',
    price: 45,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhZCUyMGJha2VyeSUyMGZyZXNofGVufDF8fHx8MTc3MDY1MzMxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Bakery',
    unit: '400g',
    stock: 25,
    rating: 4.4,
    reviews: 67,
  },
  {
    id: '5',
    name: 'Potato Chips',
    description: 'Crispy and delicious potato chips',
    price: 30,
    image: 'https://images.unsplash.com/photo-1741520149938-4f08654780ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFja3MlMjBjaGlwcyUyMHBhY2thZ2VkfGVufDF8fHx8MTc3MDY0MjM2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Snacks',
    unit: '100g',
    stock: 60,
    rating: 4.2,
    reviews: 142,
  },
  {
    id: '6',
    name: 'Orange Juice',
    description: '100% pure orange juice',
    price: 120,
    originalPrice: 150,
    image: 'https://images.unsplash.com/photo-1598915850240-6e6cae81457a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXZlcmFnZXMlMjBqdWljZSUyMGRyaW5rc3xlbnwxfHx8fDE3NzA3MTY2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Beverages',
    unit: '1 L',
    stock: 35,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: '7',
    name: 'Fresh Carrots',
    description: 'Crunchy orange carrots',
    price: 35,
    image: 'https://images.unsplash.com/photo-1714224247661-ee250f55a842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc3MDYxNTA4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Vegetables',
    unit: '500g',
    stock: 45,
    rating: 4.3,
    reviews: 76,
  },
  {
    id: '8',
    name: 'Fresh Bananas',
    description: 'Ripe yellow bananas',
    price: 50,
    image: 'https://images.unsplash.com/photo-1621295538579-7fd8bb7a662a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdHMlMjBvcmdhbmljJTIwbWFya2V0fGVufDF8fHx8MTc3MDcxNjY3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fruits',
    unit: '1 dozen',
    stock: 55,
    rating: 4.5,
    reviews: 112,
  },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Snacks', 'Beverages'];

const initialState: ProductsState = {
  items: mockProducts,
  filteredItems: mockProducts,
  categories,
  selectedCategory: 'All',
  searchQuery: '',
  loading: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filteredItems = filterProducts(state.items, action.payload, state.searchQuery);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = filterProducts(state.items, state.selectedCategory, action.payload);
    },
  },
});

function filterProducts(products: Product[], category: string, searchQuery: string): Product[] {
  let filtered = products;

  if (category !== 'All') {
    filtered = filtered.filter(product => product.category === category);
  }

  if (searchQuery.trim()) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
}

export const { setCategory, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
