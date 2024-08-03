import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TRegionData } from '@/app/_types/types';

type RegionState = {
  regionData: TRegionData
}

const initialState: RegionState = {
  regionData: {
    name: 'Europe West',
    shorthand: 'EUW',
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