import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TRegionData } from '@/app/_types/types';

type TRegionState = {
  markedRegionData: TRegionData
}

const initialState: TRegionState = {
  markedRegionData: {
    name: 'Europe West',
    shorthand: 'EUW',
    image: '/regions/euw.svg',
    regionLink: 'euw1.api.riotgames.com',
    continentLink: 'europe.api.riotgames.com',
  }
}

const markedRegionDataSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    setMarkedRegionData: (state, action: PayloadAction<TRegionData>) => {
      state.markedRegionData = action.payload;
    }
  }
})

export const { setMarkedRegionData } = markedRegionDataSlice.actions;

export default markedRegionDataSlice.reducer;