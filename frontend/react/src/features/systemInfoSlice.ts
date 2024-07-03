import {SystemInfoType} from '@/types';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface SystemInfoState {
  systemInfo: SystemInfoType | undefined;
}

const initialState: SystemInfoState = {
  systemInfo: undefined,
};

const systemInfoSlice = createSlice({
  name: 'system-info',
  initialState,
  reducers: {
    setSystemInfo: (state, action: PayloadAction<SystemInfoType>) => {
      state.systemInfo = action.payload;
    },
  },
});

export const {setSystemInfo} = systemInfoSlice.actions;

export default systemInfoSlice.reducer;
