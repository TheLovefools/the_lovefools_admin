import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  formDataApi,
  SortDirection,
  TESTIMONIAL_LIST,
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
};

// Async thunks
export const getTestimonialList = createAsyncThunk(
  'testimonialList/getTestimonialList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: tesimonialListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_TESTIMONIAL_LIST, {
        ...queryParameters,
      });
      return {
        tesimonialListData,
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

export const addTestimonialList = createAsyncThunk(
  'testimonialList/addTestimonialList',
  async (tesimonialListDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_TESTIMONIAL_LIST,
        tesimonialListDetails[0],
      );

      if (data) {
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(data.data),
          formDataApi(tesimonialListDetails[1].photo),
        );
      }

      toast.success(TESTIMONIAL_LIST.TESTIMONIAL_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateTestimonialList = createAsyncThunk(
  'testimonialList/updateTestimonialList',
  async ({ id, payload }, { rejectWithValue }) => {
    // const imageName = id.photo?.split('uploads/')[1];
    const imageName = id?.photo;
    console.log('Updating image for:', id);
    console.log('Updating image data:', imageName);

    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_TESTIMONIAL_LIST(id.id),
        payload[0],
      );

      console.log('updateTestimonialList_1', data, payload, payload[1]);

      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: imageName,
        });
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(id.id),
          formDataApi(payload[1].photo),
        );
      }

      toast.success(TESTIMONIAL_LIST.TESTIMONIAL_LIST_UPDATE);
      return data;
    } catch (error) {
      console.error('Error updating Ala Carte Menu:', error);
      return rejectWithValue(error.message);
    }
  },
);

export const deleteTestimonialList = createAsyncThunk(
  'testimonialList/deleteTestimonialList',
  async (id, { rejectWithValue }) => {
    const eventId = id._id;
    // const imageName = id.photo?.split('uploads/')[1];
    const img = id?.photo;
    console.log('Deleting image for:', id);
    console.log('Deleting image data:', eventId, img);

    try {
      // Delete the testimonial
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_TESTIMONIAL_LIST(eventId),
      );

      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: img,
        });
      }
      toast.success(TESTIMONIAL_LIST.TESTIMONIAL_LIST_DELETED);
      return data;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return rejectWithValue(
        error.response?.data || 'Failed to delete testimonial',
      );
    }
  },
);

export const updateTestimonialListValues = createAsyncThunk(
  'testimonialList/updateTestimonialListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const tesimonialListSlice = createSlice({
  name: 'testimonialList',
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
      .addCase(getTestimonialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTestimonialList.fulfilled, (state, action) => {
        state.data = action.payload.tesimonialListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getTestimonialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTestimonialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTestimonialList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addTestimonialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTestimonialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonialList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateTestimonialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTestimonialListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonialListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateTestimonialListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = tesimonialListSlice.actions;

export default tesimonialListSlice.reducer;
