import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TRegionData } from '@/app/_types/types';

type TRegionState = {
  regionData: TRegionData
}

const initialState: TRegionState = {
  regionData: {
    name: 'Europe West',
    shorthand: 'EUW',
    image: '/regions/euw.svg',
    regionLink: 'euw1.api.riotgames.com',
    continentLink: 'europe.api.riotgames.com',
  }
}

const regionDataSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    getRegionData: (state, action: PayloadAction<TRegionData>) => {
      state.regionData = action.payload;
    }
  }
})

export const { getRegionData } = regionDataSlice.actions;

export default regionDataSlice.reducer;