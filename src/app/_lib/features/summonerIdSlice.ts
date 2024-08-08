import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SummonerState = {
  summonerId: string | undefined;
}

const initialState: SummonerState = {
  summonerId: ''
}

const summonerIdSlice = createSlice({
  name: 'summonerId',
  initialState,
  reducers: {
    setSummonerId: (state, action: PayloadAction<string | undefined>) => {
      state.summonerId = action.payload;
    }
  }
});

export const { setSummonerId } = summonerIdSlice.actions;

export default summonerIdSlice.reducer;