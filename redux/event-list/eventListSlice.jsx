import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  EVENT_LIST,
  eventList,
  formDataApi,
  SortDirection,
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
export const getEventList = createAsyncThunk(
  'eventList/getEventList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: eventListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_EVENT_LIST, {
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

export const addEventList = createAsyncThunk(
  'eventList/addEventList',
  async (eventListDetails, { rejectWithValue }) => {
    console.log('eventListDetails', eventListDetails);
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_EVENT_LIST,
        eventListDetails[0],
      );

      if (data) {
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(data.data),
          formDataApi(eventListDetails[1].photo),
        );
      }

      toast.success(EVENT_LIST.EVENT_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateEventList = createAsyncThunk(
  'eventList/updateEventList',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_EVENT_LIST(id.id),
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
      toast.success(EVENT_LIST.EVENT_LIST_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteEventList = createAsyncThunk(
  'eventList/deleteEventList',
  async (id) => {
    const eventId = id?._id;
    // const image_name = id.photo.split('uploads/');

    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_EVENT_LIST(eventId),
      );

      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: id?.photo,
        });
      }
      toast.success(EVENT_LIST.EVENT_LIST_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateEventListValues = createAsyncThunk(
  'eventList/updateEventListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const eventListSlice = createSlice({
  name: 'eventList',
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
      .addCase(getEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventList.fulfilled, (state, action) => {
        state.data = action.payload.eventListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEventList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateEventList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateEventList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateEventListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateEventListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = eventListSlice.actions;

export default eventListSlice.reducer;
