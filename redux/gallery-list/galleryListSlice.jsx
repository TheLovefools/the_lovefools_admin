import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  formDataApi,
  GALLERY_LIST,
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
export const getGalleryList = createAsyncThunk(
  'galleryList/getGalleryList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: galleryListData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_GALLERY_LIST, {
        ...queryParameters,
      });
      return {
        galleryListData,
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

export const addGalleryList = createAsyncThunk(
  'galleryList/addGalleryList',
  async (galleryListDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_GALLERY_LIST,
        galleryListDetails[0],
      );

      if (data) {
        if (galleryListDetails[1].photo && galleryListDetails[1].video) {
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(data.data),
            formDataApi(galleryListDetails[1].photo),
          );
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(data.data),
            formDataApi(galleryListDetails[1].video),
          );
        } else if (galleryListDetails[1].photo) {
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(data.data),
            formDataApi(galleryListDetails[1].photo),
          );
        }
      }
      toast.success(GALLERY_LIST.GALLERY_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addGalleryListNew = createAsyncThunk(
  'galleryList/addGalleryList',
  async (galleryListDetails, { rejectWithValue }) => {
    try {
      // Step 1: Make API call to create the gallery list
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_GALLERY_LIST,
        galleryListDetails[0], // Assuming the first item contains the data for the gallery list
      );

      // Step 2: If gallery list creation is successful, upload the files (photo or video)
      if (data) {
        // Use formDataApi to handle file appending (photo or video)
        let formData = null;

        // Check if there is a photo or video and prepare formData accordingly
        if (galleryListDetails[1].photo) {
          formData = formDataApi(galleryListDetails[1].photo);
        } else if (galleryListDetails[1].video) {
          formData = formDataApi(galleryListDetails[1].video);
        }

        // Step 3: Only send the upload request if there are files
        if (formData) {
          // Send the form data containing either a photo or a video
          console.log('addGallery_image_200', formData);
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(data.data), // The API endpoint, with gallery ID
            formData, // The formData containing the files
          );
        }

        console.log('addGallery_image', data);
      }

      // Success toast notification
      toast.success(GALLERY_LIST.GALLERY_LIST_SUCCESS);
      return data;
    } catch (error) {
      // Error handling
      return rejectWithValue(error.message);
    }
  },
);

export const updateGalleryList = createAsyncThunk(
  'galleryList/updateGalleryList',
  async ({ id, payload }) => {
    console.log('id', id);

    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_GALLERY_LIST(id.id),
        payload[0],
      );

      if (data) {
        const { photo, video } = payload[1];
        if (video) {
          await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
            PhotoUrl: id?.video,
          });
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(id.id),
            formDataApi(video),
          );
        }
        if (photo) {
          await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
            PhotoUrl: id?.photo,
          });
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(id.id),
            formDataApi(photo),
          );
        }
      }

      toast.success(GALLERY_LIST.GALLERY_LIST_UPDATE);
      return data;
    } catch (error) {
      console.error('Error updating gallery:', error);
      throw error;
    }
  },
);

export const deleteGalleryList = createAsyncThunk(
  'galleryList/deleteGalleryList',
  async (id) => {
    console.log('Deleting image for:', id);
    const eventId = id?._id;
    // const image_name = id.photo.split('uploads/');
    // const video_name = id.video.split('uploads/');
    const img = id?.photo;
    const vid = id?.video;
    console.log('Deleting image data:', eventId, img, vid);

    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_GALLERY_LIST(eventId),
      );
      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: id?.photo,
        });
      }
      if (data && vid[1]) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: id?.video,
        });
      }
      toast.success(GALLERY_LIST.GALLERY_LIST_DELETED);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateGalleryListValues = createAsyncThunk(
  'galleryList/updateGalleryListValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const galleryListSlice = createSlice({
  name: 'galleryList',
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
      .addCase(getGalleryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGalleryList.fulfilled, (state, action) => {
        state.data = action.payload.galleryListData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getGalleryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addGalleryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGalleryList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addGalleryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateGalleryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGalleryList.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateGalleryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateGalleryListValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGalleryListValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateGalleryListValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = galleryListSlice.actions;

export default galleryListSlice.reducer;
