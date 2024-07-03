import {RootState} from '@/store';

export const selectCategories = (state: RootState) =>
  state.categories.categories;

// export const selectSystemInfo = (state: RootState) => state.
