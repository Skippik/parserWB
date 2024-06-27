import api from '@/api';
import {configureStore} from '@reduxjs/toolkit';

const Store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // someAppSlice: someAppSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

// Для refetchOnFocus/refetchOnReconnect
import {setupListeners} from '@reduxjs/toolkit/query';
setupListeners(Store.dispatch);

export default Store;
