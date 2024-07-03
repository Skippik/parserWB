import {setSystemInfo} from '@/features/systemInfoSlice';
import {SystemInfoType} from '@/types';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const getSystemInfoApi = createApi({
  reducerPath: 'getSystemInfoApi',
  baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_APP_API_ROUTE}),
  endpoints: builder => ({
    getSystemInfo: builder.query<SystemInfoType, void>({
      query: () => 'system-info',
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          dispatch(setSystemInfo(data));
        } catch (e) {
          console.log(e);
        }
      },
    }),
  }),
});

export const {useGetSystemInfoQuery} = getSystemInfoApi;

export default getSystemInfoApi;
