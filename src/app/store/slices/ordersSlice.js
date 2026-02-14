import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        id: `ORD${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: 'pending',
      };
      state.orders.unshift(newOrder);
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find(order => order.id === id);
      if (order) {
        order.status = status;
      }
    },
  },
});

export const { placeOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;

