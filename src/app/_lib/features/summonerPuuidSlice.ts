import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SummonerState = {
  summonerPuuid: string | undefined;
}

const initialState: SummonerState = {
  summonerPuuid: ''
}

const summonerPuuidSlice = createSlice({
  name: 'summonerPuuid',
  initialState,
  reducers: {
    setSummonerPuuid: (state, action: PayloadAction<string | undefined>) => {
      state.summonerPuuid = action.payload;
    }
  }
});

export const { setSummonerPuuid } = summonerPuuidSlice.actions;

export default summonerPuuidSlice.reducer;