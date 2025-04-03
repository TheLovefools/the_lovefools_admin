import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { API_ENDPOINT, CMS_LIST, SortDirection } from '@/utils/constant';
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
export const getCMSList = createAsyncThunk(
  'cmsList/getCMSList',
  async (queryParameters, { rejectWithValue }) => {
    try {
      const {
        data: { data: cmsListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_CMS_LIST, {
        ...queryParameters,
      });
      return {
        cmsListData,
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

export const updateCMSList = createAsyncThunk(
  'cmsList/updateCMSList',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_CMS_LIST(id),
        payload,
      );
      toast.success(CMS_LIST.CMS_LIST_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateCMSListValues = createAsyncThunk(
  'cmsList/updateCMSListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const cmsListSlice = createSlice({
  name: 'cmsList',
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
      .addCase(getCMSList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCMSList.fulfilled, (state, action) => {
        state.data = action.payload.cmsListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getCMSList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCMSList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCMSList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateCMSList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCMSListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCMSListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateCMSListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = cmsListSlice.actions;

export default cmsListSlice.reducer;
