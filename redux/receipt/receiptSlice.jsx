import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  ERROR_MESSAGES,
  formDataApi,
  RECEIPT,
  SortDirection,
} from '@/utils/constant';
import { toast } from 'react-toastify';

// const initialListParameters = {
//   page: 1,
//   limit: 10,
//   sortBy: 'id',
//   sortOrder: SortDirection.DESC,
//   search: '',
// };

const initialListParameters = {
  page: 1,
  limit: 10,
  sortBy: 'created_date', // updated to sort by created_date
  sortOrder: SortDirection.DESC, // keep DESC if you want newest first
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
export const getReceiptList = createAsyncThunk(
  'receipt/getReceiptList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: receiptData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_RECEIPT, {
        ...queryParameters,
      });
      return {
        receiptData,
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

export const addReceipt = createAsyncThunk(
  'receipt/addReceipt',
  async (receiptDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINT.ADD_RECEIPT, {
        ...receiptDetails,
      });

      toast.success(RECEIPT.RECEIPT_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateReceipt = createAsyncThunk(
  'receipt/updateReceipt',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_RECEIPT(id),
        { ...payload },
      );
      toast.success(RECEIPT.RECEIPT_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteReceipt = createAsyncThunk(
  'receipt/deleteReceipt',
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_RECEIPT(id),
      );
      toast.success(RECEIPT.RECEIPT_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updatereceiptValues = createAsyncThunk(
  'receipt/updatereceiptValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const receiptSlice = createSlice({
  name: 'receipt',
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
      .addCase(getReceiptList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceiptList.fulfilled, (state, action) => {
        state.data = action.payload.receiptData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getReceiptList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReceipt.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReceipt.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatereceiptValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatereceiptValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updatereceiptValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = receiptSlice.actions;

export default receiptSlice.reducer;
