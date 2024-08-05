import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageData } from '../utils';
import type { TLocalStorageSummoner } from '@/app/_types/types';

type TLocalStorageState = {
  localStorageFavoriteSummoners: Array<TLocalStorageSummoner>;
}

const initialState: TLocalStorageState = {
  localStorageFavoriteSummoners: getLocalStorageData('favoriteSummoners')
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