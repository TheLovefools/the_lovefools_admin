import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { API_ENDPOINT, ROOM_LIST, SortDirection } from '@/utils/constant';
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
  tab: '',
};

// Async thunks
export const getRoomList = createAsyncThunk(
  'roomList/getRoomList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: roomListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_ROOM_LIST, {
        ...queryParameters,
      });
      return {
        roomListData,
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

export const addRoomList = createAsyncThunk(
  'roomList/addRoomList',
  async (roomListDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINT.ADD_ROOM_LIST, {
        ...roomListDetails,
      });
      toast.success(ROOM_LIST.ROOM_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateRoomList = createAsyncThunk(
  'roomList/updateRoomList',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_ROOM_LIST(id),
        { ...payload },
      );
      toast.success(ROOM_LIST.ROOM_LIST_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteRoomList = createAsyncThunk(
  'roomList/deleteRoomList',
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_ROOM_LIST(id),
      );
      toast.success(ROOM_LIST.ROOM_LIST_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateRoomListValues = createAsyncThunk(
  'roomList/updateRoomListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const roomListSlice = createSlice({
  name: 'roomList',
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
      .addCase(getRoomList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomList.fulfilled, (state, action) => {
        state.data = action.payload.roomListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getRoomList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addRoomList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoomList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addRoomList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateRoomList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateRoomList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateRoomListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateRoomListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = roomListSlice.actions;

export default roomListSlice.reducer;
