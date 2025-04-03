import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { API_ENDPOINT, CONTACT_FORM, SortDirection } from '@/utils/constant';
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
export const getContactFormList = createAsyncThunk(
  'getContactFormList/getContactFormList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: contactFormData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_CONTACT_FORM, {
        ...queryParameters,
      });
      return {
        contactFormData,
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

export const deleteContactFormList = createAsyncThunk(
  'contactForm/deleteContactForm',
  async ({ id }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_CONTACT_FORM(id),
      );
      toast.success(CONTACT_FORM.CONTACT_FORM_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateContactFormValues = createAsyncThunk(
  'contactForm/updateContactFormValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const contactFormSlice = createSlice({
  name: 'contactForm',
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
      .addCase(getContactFormList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactFormList.fulfilled, (state, action) => {
        state.data = action.payload.contactFormData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getContactFormList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateContactFormValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactFormValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateContactFormValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = contactFormSlice.actions;

export default contactFormSlice.reducer;
