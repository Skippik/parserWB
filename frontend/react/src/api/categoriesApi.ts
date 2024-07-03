import {setCategories} from '@/features/categoriesSlice';
import {CategoryType} from '@/types';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const getCategoriesApi = createApi({
  reducerPath: 'getCategoriesApi',
  baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_APP_API_ROUTE}),
  endpoints: builder => ({
    getCategories: builder.query<CategoryType[], void>({
      query: () => 'categories',
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          dispatch(setCategories(data));
        } catch (e) {
          console.error('Error fetching system info:', e);
        }
      },
    }),
  }),
});

export const {useGetCategoriesQuery} = getCategoriesApi;

export default getCategoriesApi;
