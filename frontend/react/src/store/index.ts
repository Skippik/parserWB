import categoriesApi, {getCategoriesApi} from '@/api/categoriesApi';
import systemInfoApi, {getSystemInfoApi} from '@/api/systemInfoApi';
import {configureStore} from '@reduxjs/toolkit';

const Store = configureStore({
  reducer: {
    [getCategoriesApi.reducerPath]: getCategoriesApi.reducer,
    [getSystemInfoApi.reducerPath]: getSystemInfoApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      categoriesApi.middleware,
      systemInfoApi.middleware,
      // Добавляйте сюда другие middlewares по мере необходимости
    ),
});

// Для refetchOnFocus/refetchOnReconnect
// import {setupListeners} from '@reduxjs/toolkit/query';
// setupListeners(Store.dispatch);

export type RootState = ReturnType<typeof Store.getState>;

export default Store;

export {useGetCategoriesQuery} from '../api/categoriesApi';
export {useGetSystemInfoQuery} from '../api/systemInfoApi';
