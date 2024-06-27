import {CategoryType} from '@/types';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
export const url = (endpoint: string) => {
  return import.meta.env.VITE_APP_API_ROUTE + endpoint;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_APP_API_ROUTE}),
  endpoints: builder => ({
    getCategories: builder.query<CategoryType[], void>({
      query: () => 'categories',
    }),
  }),
});

export const {useGetCategoriesQuery} = api;

export default api;
