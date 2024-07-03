// src/api/apiConfig.ts
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_ROUTE,
});

//
// Функция для получения полного URL
export const url = (endpoint: string) => {
  return `${import.meta.env.VITE_APP_API_ROUTE}/${endpoint}`;
};
