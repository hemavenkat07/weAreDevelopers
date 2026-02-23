import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

const initialState = {
  orders: [],
  loading: false,
  placeOrderLoading: false,
  error: null,
};

export const fetchOrdersThunk = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const placeOrderThunk = createAsyncThunk(
  'orders/place',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeOrderThunk.pending, (state) => {
        state.placeOrderLoading = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.placeOrderLoading = false;
        state.error = null;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.placeOrderLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
