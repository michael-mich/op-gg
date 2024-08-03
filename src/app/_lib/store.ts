import { configureStore } from '@reduxjs/toolkit';
import regionDataReducer from './features/regionDataSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      regionData: regionDataReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];