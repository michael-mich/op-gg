import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/_hooks/useReduxHooks';
import { setLocalStorageFavoriteSummoners } from '@/app/_lib/features/localStorageFavoriteSummonersSlice';
import { getLocalStorageData } from '@/app/_utils/utils';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import type { TSetState } from '@/app/_types/tuples';
import { LocalStorageKeys } from '@/app/_enums/enums';
import SearchHistory from './SearchHistory';
import FavoriteSummoners from './FavoriteSummoners';

type Props = {
  pageOtherThanHomePage: boolean;
  setDisplaySummonerSections: TSetState<boolean>;
}

const SummonerSections = ({ pageOtherThanHomePage, setDisplaySummonerSections }: Props) => {
  const dispatch = useAppDispatch();
  const [localStorageSearchHistory, setLocalStorageSearchHistory] = useState<Array<TLocalStorageSummoner>>([]);
  const [displaySection, setDisplaySection] = useState(0);

  const removeSummonerFromLocalStorage = (index: number, localStorageKey: LocalStorageKeys): Array<TLocalStorageSummoner> => {
    const storageData = getLocalStorageData(localStorageKey) || [];
    storageData.splice(index, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(storageData));
    return storageData;
  }

  const handleMouseInteraction = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    setLocalStorageSearchHistory(getLocalStorageData(LocalStorageKeys.SearchHistory)!);
    dispatch(setLocalStorageFavoriteSummoners(getLocalStorageData(LocalStorageKeys.FavoriteSummoners)!));
  }, []);

  return (
    <div className={`${pageOtherThanHomePage ? 'top-8 max-w-[472px] left-0' : 'top-[3.2rem]'} 
    absolute left-0 z-50 w-full bg-white dark:bg-darkMode-mediumGray rounded-b shadow-custom-shadow`}
    >
      <div className='flex items-center'>
        <button
          onClick={() => setDisplaySection(0)}
          className={`flex-1 text-sm ${displaySection !== 0 && 'bg-[#ebeef1] dark:bg-darkMode-darkGray'}
          text-secondGray dark:text-mediumGrayText py-2`}
          type='button'
        >
          Recent Search
        </button>
        <button
          onClick={() => setDisplaySection(1)}
          className={`flex-1 text-sm ${displaySection !== 1 && 'bg-[#ebeef1] dark:bg-darkMode-darkGray'} 
          text-secondGray dark:text-mediumGrayText py-2`}
          type='button'
        >
          Favorites
        </button>
      </div>
      <SearchHistory
        handleMouseInteraction={handleMouseInteraction}
        setDisplaySummonerSections={setDisplaySummonerSections}
        localStorageSearchHistory={localStorageSearchHistory}
        setLocalStorageSearchHistory={setLocalStorageSearchHistory}
        removeSummonerFromLocalStorage={removeSummonerFromLocalStorage}
        displaySection={displaySection}
      />
      <FavoriteSummoners
        handleMouseInteraction={handleMouseInteraction}
        setDisplaySummonerSections={setDisplaySummonerSections}
        removeSummonerFromLocalStorage={removeSummonerFromLocalStorage}
        displaySection={displaySection}
      />
    </div>
  );
}

export default SummonerSections;