import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TLocalStorageSummoner } from '@/app/_types/types';

type TLocalStorageState = {
  localStorageFavoriteSummoners: Array<TLocalStorageSummoner>;
}

const initialState: TLocalStorageState = {
  localStorageFavoriteSummoners: []
}

const localStorageFavoriteSummonersSlice = createSlice({
  name: 'favoriteSummoners',
  initialState,
  reducers: {
    setLocalStorageFavoriteSummoners: (state, action: PayloadAction<Array<TLocalStorageSummoner>>) => {
      state.localStorageFavoriteSummoners = action.payload;
    }
  }
})

export const { setLocalStorageFavoriteSummoners } = localStorageFavoriteSummonersSlice.actions;

export default localStorageFavoriteSummonersSlice.reducer;