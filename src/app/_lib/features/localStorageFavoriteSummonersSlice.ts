import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageData } from '../../_utils/utils';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import { LocalStorageKeys } from '@/app/_enums/enums';

type TLocalStorageState = {
  localStorageFavoriteSummoners: Array<TLocalStorageSummoner>;
}

const initialState: TLocalStorageState = {
  localStorageFavoriteSummoners: getLocalStorageData(LocalStorageKeys.FavoriteSummoners) || []
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