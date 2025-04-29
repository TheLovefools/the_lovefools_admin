import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
  API_ENDPOINT,
  ERROR_MESSAGES,
  formDataApi,
  MENU_LIST,
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
export const getMenuList = createAsyncThunk(
  'menu/getMenuList',
  async (queryParameters, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { data: menuData, pageData: meta },
      } = await axiosInstance.post(API_ENDPOINT.GET_MENU_LIST, {
        ...queryParameters,
      });
      return {
        menuData,
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

export const addMenu = createAsyncThunk(
  'menu/addMenu',
  async (menuDetails, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.ADD_MENU_LIST,
        menuDetails[0],
      );

      if (data && menuDetails[1].photo) {
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(data.data),
          formDataApi(menuDetails[1].photo),
        );
      }

      toast.success(MENU_LIST.MENU_LIST_SUCCESS);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateMenu = createAsyncThunk(
  'menu/updateMenu',
  async ({ id, payload }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINT.UPDATE_MENU_LIST(id),
        payload[0],
      );

      if (data && menuDetails[1].photo) {
        await axiosInstance.post(
          API_ENDPOINT.UPLOAD_PHOTO(data.data),
          formDataApi(payload[1].photo),
        );
      }
      toast.success(MENU_LIST.MENU_LIST_UPDATE);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const deleteMenu = createAsyncThunk('menu/deleteMenu', async (id) => {
  const eventId = id?._id;
  // const image_name = id?.photo?.split('uploads/');
  const image_name = id?.photo;
  try {
    const { data } = await axiosInstance.post(
      API_ENDPOINT.DELETE_MENU_LIST(eventId),
    );

    if (data && image_name) {
      await axiosInstance.post(API_ENDPOINT.DELETE_PHOTO, {
        PhotoUrl: image_name,
      });
    }
    toast.success(MENU_LIST.MENU_LIST_DELETED);
    return data;
  } catch (error) {
    console.log(error);
  }
});

const menuSlice = createSlice({
  name: 'menu',
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
      .addCase(getMenuList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        state.data = action.payload.menuData;
        state.total = action.payload.total;
        state.listParameters = action.payload.updatedListParams;
        state.loading = false;
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenu.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(addMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.data = action.payload || [];
        state.defaultValues = action.payload || null;
        state.loading = false;
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateListParameters, setLoading } = menuSlice.actions;

export default menuSlice.reducer;
