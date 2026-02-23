import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      return { user: data.user, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      return { user: data.user, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchUserThunk = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/auth/me', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const refillWalletThunk = createAsyncThunk(
  'auth/refillWallet',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/wallet/refill');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Refill failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    setUserFromToken: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = { ...action.payload.user, id: action.payload.user._id };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        const u = action.payload.user;
        state.user = { ...u, id: u._id, walletBalance: u.walletBalance };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        const u = action.payload;
        state.user = { ...u, id: u._id, walletBalance: u.walletBalance };
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        const u = action.payload;
        state.user = { ...u, id: u._id, walletBalance: u.walletBalance };
      })
      .addCase(refillWalletThunk.fulfilled, (state, action) => {
        const u = action.payload;
        state.user = { ...state.user, ...u, id: u._id, walletBalance: u.walletBalance };
      });
  },
});

export const { logout, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
