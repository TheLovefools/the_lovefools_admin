import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  ENQUIRY,
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
export const getEventEnquiryList = createAsyncThunk(
  'enquiryEventList/getEventEnquiryList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: eventListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_ENQUIRY_LIST, {
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

export const addEventEnquiryList = createAsyncThunk(
  'enquiryEventList/addEventEnquiryList',
  async (eventListDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINT.ADD_ENQUIRY_LIST, {
        ...eventListDetails,
      });

      toast.success(ENQUIRY.ENQUIRY_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateEventEnquiryList = createAsyncThunk(
  'enquiryEventList/updateEventEnquiryList',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_ENQUIRY_LIST(id),
        { ...payload },
      );
      toast.success(ENQUIRY.ENQUIRY_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteEventEnquiryList = createAsyncThunk(
  'enquiryEventList/deleteEventEnquiryList',
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_ENQUIRY_LIST(id),
      );
      toast.success(ENQUIRY.ENQUIRY_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

const eventEnquiryListSlice = createSlice({
  name: 'enquiryEventList',
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
      .addCase(getEventEnquiryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventEnquiryList.fulfilled, (state, action) => {
        state.data = action.payload.eventListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getEventEnquiryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addEventEnquiryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEventEnquiryList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addEventEnquiryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateEventEnquiryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventEnquiryList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateEventEnquiryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } =
  eventEnquiryListSlice.actions;

export default eventEnquiryListSlice.reducer;
