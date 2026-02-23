import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Snacks', 'Beverages'];

const initialState = {
  items: [],
  filteredItems: [],
  categories,
  selectedCategory: 'All',
  searchQuery: '',
  loading: false,
  error: null,
};

function filterProducts(products, category, searchQuery) {
  let filtered = products;
  if (category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (searchQuery?.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export const fetchProductsThunk = createAsyncThunk(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products');
      return data.map((p) => ({ ...p, id: p._id }));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filteredItems = filterProducts(state.items, action.payload, state.searchQuery);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredItems = filterProducts(state.items, state.selectedCategory, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.filteredItems = filterProducts(
          action.payload,
          state.selectedCategory,
          state.searchQuery
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategory, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
