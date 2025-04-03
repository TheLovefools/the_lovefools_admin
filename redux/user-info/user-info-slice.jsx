import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { API_ENDPOINT } from '@/utils/constant';

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk to fetch logged-in user details
export const getLoggedInUsersDetails = createAsyncThunk(
  'userInfo/getLoggedInUsersDetails',
  async (_, { rejectWithValue }) => {
    try {
      const data = {
        fullName: 'Ajinkya',
      };
      // const { data } = await axiosInstance.get(API_ENDPOINT.LOGGEDIN_USER);
      return data;
    } catch (error) {
      throw error;
    }
  },
);

// Slice
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...action.payload };
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUsersDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoggedInUsersDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getLoggedInUsersDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setUser, removeUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;
