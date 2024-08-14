import { configureStore } from '@reduxjs/toolkit';
import markedRegionDataReducer from './features/markedRegionDataSlice';
import localStorageFavoriteSummonersReducer from './features/localStorageFavoriteSummonersSlice';
import summonerIdReducer from './features/summonerIdSlice';
import summonerPuuidReducer from './features/summonerPuuidSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      markedRegionData: markedRegionDataReducer,
      localStorageFavoriteSummoners: localStorageFavoriteSummonersReducer,
      summonerId: summonerIdReducer,
      summonerPuuid: summonerPuuidReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];