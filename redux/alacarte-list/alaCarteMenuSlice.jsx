import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  formDataApi,
  ALA_CARTE_LIST,
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
export const getAlaCarteMenu = createAsyncThunk(
  'alaCarteList/getAlaCarteMenu',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: alaCarteMenuData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_ALA_CARTE_LIST, {
        ...queryParameters,
      });
      return {
        alaCarteMenuData,
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

export const addAlaCarteMenuOld = createAsyncThunk(
  'alaCarteList/addAlaCarteMenu',
  async (alaCarteMenuDetails, { rejectWithValue }) => {
    console.log('addAlaCarteMenu_0', alaCarteMenuDetails);
    try {
      // Step 1: Make API call to create the alaCarteMenu list
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_ALA_CARTE_LIST,
        alaCarteMenuDetails[0], // Assuming the first item contains the data for the alaCarteMenu list
      );

      console.log('addAlaCarteMenu_1', data);

      // Step 2: If alaCarteMenu list creation is successful, prepare the form data
      if (data) {
        // Use formDataApi to handle file appending (photo or video)
        let formData = null;

        // Check if there is a photo
        if (alaCarteMenuDetails[1].photo) {
          formData = formDataApi(alaCarteMenuDetails[1].photo);
        }
        // Step 3: Only send the upload request if there are files
        if (formData) {
          // Send the form data containing either a photo or a video
          console.log('addAlaCarteMenu_image_200', formData);
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(data.data), // The API endpoint, with gallery ID
            formData, // The formData containing the files
          );
        }

        console.log('addAlaCarteMenu_image', alaCarteMenuDetails, data);
      }

      // Success toast notification
      toast.success(ALA_CARTE_LIST.ALA_CARTE_LIST_SUCCESS);
      return data;
    } catch (error) {
      console.log('addAlaCarteMenu_4', error.message);
      // Error handling
      return rejectWithValue(error.message);
    }
  },
);

export const addAlaCarteMenu = createAsyncThunk(
  'alaCarteList/addAlaCarteMenu',
  async (alaCarteMenuDetails, { rejectWithValue }) => {
    console.log('addAlaCarteMenu_0', alaCarteMenuDetails);
    try {
      // Step 1: Make API call to create the alaCarteMenu list
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_ALA_CARTE_LIST,
        alaCarteMenuDetails[0], // First payload with details
      );

      console.log('addAlaCarteMenu_1', data);

      if (data) {
        let formData = null;

        // 👉 Check if photo exists and is a File object or valid non-empty string
        const photo = alaCarteMenuDetails[1].photo;
        if (photo && typeof photo === 'object' && photo instanceof File) {
          formData = formDataApi(photo);
        }

        // Step 3: Upload only if formData was prepared (photo exists)
        if (formData) {
          console.log('addAlaCarteMenu_image_200', formData);
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(data.data), // The new menu ID
            formData,
          );
        } else {
          console.log('No photo uploaded; skipping upload step.');
        }

        console.log('addAlaCarteMenu_image', alaCarteMenuDetails, data);
      }

      toast.success(ALA_CARTE_LIST.ALA_CARTE_LIST_SUCCESS);
      return data;
    } catch (error) {
      console.log('addAlaCarteMenu_4', error.message);
      return rejectWithValue(error.message);
    }
  },
);

export const updateAlaCarteMenu = createAsyncThunk(
  'alaCarteList/updateAlaCarteMenu',
  async ({ id, payload }, { rejectWithValue }) => {
    console.log('id', id);
    try {
      // Step 1: Update the ala carte menu details (first API call)
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_ALA_CARTE_LIST(id.id),
        payload[0],
      );

      console.log('updateAlaCarteMenu_1', data, payload, payload[1]);

      // if (data) {
      //   const { photo, video } = payload[1];
      //   if (photo) {
      //     await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
      //       PhotoUrl: id?.photo,
      //     });
      //     await axiosInstance.post(
      //       API_ENDPOINT.UPLOAD_PHOTO(id.id),
      //       formDataApi(photo),
      //     );
      //   }
      // }

      if (data) {
        const { photo, video } = payload[1];
        if (photo && id?.photo) {
          // Proceed only if there's a photo to delete
          await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
            PhotoUrl: id.photo, // Send the correct existing photo URL for deletion
          });
          await axiosInstance.post(
            API_ENDPOINT.UPLOAD_PHOTO(id.id),
            formDataApi(photo),
          );
        } else {
          console.log('No photo to delete or upload');
        }
      }

      // Step 4: Return data and show success toast
      toast.success(ALA_CARTE_LIST.ALA_CARTE_LIST_UPDATE);
      return data;
    } catch (error) {
      console.error('Error updating Ala Carte Menu:', error);
      return rejectWithValue(error.message);
    }
  },
);

export const deleteAlaCarteMenu = createAsyncThunk(
  'alaCarteList/deleteAlaCarteMenu',
  async (id, { rejectWithValue }) => {
    console.log('Deleting image for:', id);
    const eventId = id?._id;

    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.DELETE_ALA_CARTE_LIST(eventId),
      );
      if (data) {
        await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
          PhotoUrl: id?.photo,
        });
      }
      toast.success(GALLERY_LIST.ALA_CARTE_LIST_DELETED);
      return data;
    } catch (error) {
      console.error('Error deleting image:', error.message); // Log error details
      return rejectWithValue(error.message);
    }
  },
);

export const updateAlaCarteMenuValues = createAsyncThunk(
  'alaCarteList/updateAlaCarteMenuValues',
  async (defaultValues, { rejectWithValue }) => {
    try {
      return defaultValues;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const alaCarteMenuSlice = createSlice({
  name: 'alaCarteList',
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
      .addCase(getAlaCarteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlaCarteMenu.fulfilled, (state, action) => {
        state.data = action.payload.alaCarteMenuData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getAlaCarteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAlaCarteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAlaCarteMenu.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addAlaCarteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAlaCarteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlaCarteMenu.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateAlaCarteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAlaCarteMenuValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlaCarteMenuValues.fulfilled, (state, action) => {
        state.defaultValues = action.payload;
        state.loading = false;
      })
      .addCase(updateAlaCarteMenuValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = alaCarteMenuSlice.actions;

export default alaCarteMenuSlice.reducer;
