import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { API_ENDPOINT, USER_LIST, SortDirection } from '@/utils/constant';
import { toast } from 'react-toastify';

const initialListParameters = {
  page: 1,
  limit: 10,
  sortBy: 'id',
  sortOrder: SortDirection.DESC,
  search: '',
};

const initialState = {
  data: [],
  defaultValues: null,
  total: 0,
  loading: false,
  error: null,
  listParameters: initialListParameters,
};

// Async thunks
export const getUserList = createAsyncThunk(
  'userList/getUserList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: userListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_USER_LIST, {
        ...queryParameters,
      });
      return {
        userListData,
        total: meta.total,
        updatedListParams: {
          ...queryParameters,
          page: meta.page,
          limit: meta.limit,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addUserList = createAsyncThunk(
  'userList/addUserList',
  async (userListDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_USER_LIST,
        userListDetails,
      );
      toast.success(USER_LIST.USER_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserList = createAsyncThunk(
  'userList/updateUserList',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_USER_LIST(id),
        payload,
      );
      toast.success(USER_LIST.USER_LIST_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteUserList = createAsyncThunk(
  'userList/deleteuserList',
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_USER_LIST(id),
      );
      toast.success(USER_LIST.USER_LIST_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateUserListValues = createAsyncThunk(
  'userList/updateuserListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    updateListParameters: (state, action) => {
      state.listParameters = { ...state.listParameters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload.loading;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.data = action.payload.userListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateUserListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = userListSlice.actions;

export default userListSlice.reducer;
