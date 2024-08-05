import { configureStore } from '@reduxjs/toolkit';
import regionDataReducer from './features/regionDataSlice';
import localStorageFavoriteSummonersReducer from './features/localStorageFavoriteSummonersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      regionData: regionDataReducer,
      localStorageFavoriteSummoners: localStorageFavoriteSummonersReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];