import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from 'cookies-next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NEXT_PUBLIC_API_URL } from '@/utils/constant';

const initialState = {
  isAuthenticated: false,
  loading: false,
  isInitialized: false,
  accessToken: '',
  user: null, // Added user state
  error: null,
};

// Async thunks
export const getLoggedInUsersDetails = createAsyncThunk(
  'auth/getLoggedInUsersDetails',
  async (_, { rejectWithValue }) => {
    try {
      // const { data } = await axios.get(API_ENDPOINT.LOGGEDIN_USER);
      const data = {
        fullName: 'Ajinkya',
      };
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const handleLogin = createAsyncThunk(
  'auth/handleLogin',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
       `${NEXT_PUBLIC_API_URL}login`,
        credentials,
      );

      setCookie('isAuthenticated', true);
      setCookie('token', data.accessToken);
      setCookie('refreshToken', data.refreshToken);

      const userResponse = await dispatch(getLoggedInUsersDetails()).unwrap();

      dispatch(login({ ...data }));
      dispatch(setUser({ ...userResponse }));

      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(handleLogout());
      return rejectWithValue(error.message);
    }
  },
);

export const handleAuth = createAsyncThunk('auth/handleAuth', () => {});

export const handleLogout = createAsyncThunk(
  'auth/handleLogout',
  async (_, { dispatch }) => {
    deleteCookie('isAuthenticated');
    deleteCookie('token');
    deleteCookie('refreshToken');
    dispatch(removeUser());
    return true;
  },
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = '';
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.accessToken = '';
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(handleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLoggedInUsersDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoggedInUsersDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getLoggedInUsersDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
      });
  },
});

export const { setInitialized, login, logout, setUser, removeUser } =
  authSlice.actions;
export default authSlice.reducer;
