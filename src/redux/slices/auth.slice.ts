/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import userApi from '../../api/userApi';
import { RegisterLocalRequest, postLoginRequest } from '../../types/User';

export interface CustomerInfo {
  customer_id: number;
  vip_id: number;
  loyalty_point: number;
  total_spent: number | string; // nếu BE trả string thì giữ string
}

export interface UserProfile {
  user_id: number;
  name: string;
  username: string;
  phone: string | null;
  avatar: string | null;
  address: string;
  role: string;
  email?: string;
  account_id?: number;
  created_at?: string;
  updated_at?: string;
  customer?: CustomerInfo | null;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

// Đăng ký
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterLocalRequest, { rejectWithValue }) => {
    try {
      const response = await userApi.register(userData);
      console.log(' registerUser response:', response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

// Đăng nhập + lấy thông tin user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: postLoginRequest, { rejectWithValue }) => {
    try {
      const response = await userApi.loginWithCustomer(loginData);
      const { token, expires } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpires', expires);

      const meRes = await userApi.getMe();
      const rawUser = meRes.data.user;

      console.log(' [loginUser] token:', token);
      console.log(' [loginUser] rawUser:', rawUser);

      const user: UserProfile = { ...rawUser };

      return { token, user };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// getMe khi reload trang
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getMe();
      const rawUser = response.data.user;

      console.log(' [getMe] rawUser:', rawUser);

      const user: UserProfile = { ...rawUser };

      return user;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpires');
    },
  },
  extraReducers: (builder) => {
    builder
      // Đăng ký
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(registerUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = null;
  state.token = null;
})
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Đăng nhập
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpires');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
