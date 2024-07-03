import rootReducer from '@/api';
import categoriesApi from '@/api/categoriesApi';
import systemInfoApi from '@/api/systemInfoApi';
import {configureStore} from '@reduxjs/toolkit';

const Store = configureStore({
  reducer: rootReducer,
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
