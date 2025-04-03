import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  EVENT_LIST,
  upcomingEventList,
  formDataApi,
  SortDirection,
  UPCOMING_EVENT_LIST,
} from '@/utils/constant';
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
export const getUpcomingEventList = createAsyncThunk(
  'upcomingEventList/getUpcomingEventList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: eventListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_UPCOMING_EVENT_LIST, {
        ...queryParameters,
      });
      return {
        eventListData,
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

export const addUpcomingEventList = createAsyncThunk(
  'upcomingEventList/addUpcomingEventList',
  async (eventListDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_UPCOMING_EVENT_LIST,
        eventListDetails[0],
      );

      if (data) {
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(data.data),
          formDataApi(eventListDetails[1].photo),
        );
      }

      toast.success(UPCOMING_EVENT_LIST.UPCOMING_EVENT_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUpcomingEventList = createAsyncThunk(
  'upcomingEventList/updateUpcomingEventList',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_UPCOMING_EVENT_LIST(id.id),
        payload[0],
      );

      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: id?.photo,
        });
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(id.id),
          formDataApi(payload[1].photo),
        );
      }
      toast.success(UPCOMING_EVENT_LIST.UPCOMING_EVENT_LIST_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteUpcomingEventList = createAsyncThunk(
  'upcomingEventList/deleteUpcomingEventList',
  async ({ id }) => {
    const eventId = id?._id;
    const image_name = id.photo.split('uploads/');
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_UPCOMING_EVENT_LIST(eventId),
      );
      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: id?.photo,
        });
      }
      toast.success(UPCOMING_EVENT_LIST.UPCOMING_EVENT_LIST_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateUpcomingEventListValues = createAsyncThunk(
  'upcomingEventList/updateUpcomingEventListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const upcomingEventListSlice = createSlice({
  name: 'upcomingEventList',
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
      .addCase(getUpcomingEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpcomingEventList.fulfilled, (state, action) => {
        state.data = action.payload.eventListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getUpcomingEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addUpcomingEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUpcomingEventList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addUpcomingEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUpcomingEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUpcomingEventList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateUpcomingEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUpcomingEventListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUpcomingEventListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateUpcomingEventListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } =
  upcomingEventListSlice.actions;

export default upcomingEventListSlice.reducer;
