// src/api/selectors.ts

import getCategoriesApi from '@/api/categoriesApi';
import getSystemInfoApi from '@/api/systemInfoApi';
import {RootState} from '@/store';

// Селектор для категорий
export const selectCategories = (state: RootState) =>
  getCategoriesApi.endpoints.getCategories.select()(state);

// Селектор для системной информации
export const selectSystemInfo = (state: RootState) =>
  getSystemInfoApi.endpoints.getSystemInfo.select()(state);
