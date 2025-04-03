import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'auth',
    'userInfo',
    'upcomingEventList',
    'cmsList',
    'contactForm',
    'eventEnquiryList',
    'eventList',
    'galleryList',
    'menuList',
    'receipt',
    'roomList',
    'tableList',
    'testimonialList',
    'userList',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
