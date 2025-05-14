import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  PARTY_LIST,
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
export const getPartyList = createAsyncThunk(
  'partyList/getPartyList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: partyBookingData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_PARTY_LIST, {
        ...queryParameters,
      });
      return {
        partyBookingData,
        total: meta.total,
        updatedPartyParams: {
          ...queryParameters,
          page: meta.page,
          limit: meta.limit,
        },
      };
    } catch (error) {
      console.log('Error fetching Party Bookings:', error);
      return rejectWithValue(error.message);
    }
  },
);

export const addPartyList = createAsyncThunk(
  'partyList/addPartyList',
  async (partyListDetails, { rejectWithValue }) => {
    console.log('partyListDetails', partyListDetails);
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_PARTY_LIST,
        partyListDetails[0],
      );
      toast.success(PARTY_LIST.PARTY_LIST_SUCCESS);
      return data;
    } catch (error) {
      console.log('Error adding Party Booking:', error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const updatePartyList = createAsyncThunk(
  'partyList/updatePartyList',
  async ({ id, payload }, { rejectWithValue }) => {
    console.log('id', id);
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_PARTY_LIST(id.id),
        payload[0],
      );
      toast.success(PARTY_LIST.PARTY_LIST_UPDATE);
      return data;
    } catch (error) {
      console.error('Error updating Party Booking:', error);
      return rejectWithValue(error.message);
    }
  },
);

export const deletePartyList = createAsyncThunk(
  'partyList/deletePartyList',
  async (id) => {
    const partyId = id?._id;
    // const image_name = id.photo.split('uploads/');

    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_PARTY_LIST(partyId),
      );
      toast.success(PARTY_LIST.PARTY_LIST_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

const partyListSlice = createSlice({
  name: 'partyList',
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
      .addCase(getPartyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartyList.fulfilled, (state, action) => {
        state.data = action.payload.partyBookingData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedPartyParams;
        state.loading = false;
      })
      .addCase(getPartyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addPartyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPartyList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addPartyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePartyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePartyList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updatePartyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = partyListSlice.actions;

export default partyListSlice.reducer;
