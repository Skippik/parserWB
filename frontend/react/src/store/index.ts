import api from '@/api';
import categoriesSlice from '@/features/categoriesSlice';
import {configureStore} from '@reduxjs/toolkit';

const Store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    categories: categoriesSlice,
    // someAppSlice: someAppSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

// Для refetchOnFocus/refetchOnReconnect
// import {setupListeners} from '@reduxjs/toolkit/query';
// setupListeners(Store.dispatch);

export type RootState = ReturnType<typeof Store.getState>;

export default Store;
