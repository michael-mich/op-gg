import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/_lib/hooks/reduxHooks';
import { setLocalStorageFavoriteSummoners } from '@/app/_lib/features/localStorageFavoriteSummonersSlice';
import { getLocalStorageData } from '@/app/_lib/utils';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import SearchHistory from './SearchHistory';
import FavoriteSummoners from './FavoriteSummoners';

type Props = {
  pageOtherThanHomePage: boolean;
  setDisplaySummonerSections: React.Dispatch<React.SetStateAction<boolean>>;
  displaySummonerSections: boolean;
}

const SummonerSections = ({
  pageOtherThanHomePage,
  setDisplaySummonerSections,
  displaySummonerSections
}: Props) => {
  const dispatch = useAppDispatch();
  const [localStorageSearchHistory, setLocalStorageSearchHistory] = useState<Array<TLocalStorageSummoner>>([]);
  const [displaySection, setDisplaySection] = useState(0);

  const removeSummonerFromLocalStorage = (index: number, localStorageKey: string): Array<TLocalStorageSummoner> => {
    const storageData = getLocalStorageData(localStorageKey);
    storageData.splice(index, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(storageData));
    return storageData;
  }

  const handleMouseInteraction = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    setLocalStorageSearchHistory(getLocalStorageData('searchHistory'));
    dispatch(setLocalStorageFavoriteSummoners(getLocalStorageData('favoriteSummoners')));
  }, []);

  return (
    <div className={`${displaySummonerSections ? 'block' : 'hidden'} ${pageOtherThanHomePage ? 'top-8 max-w-[472px] left-0' : 'top-[3.2rem]'} 
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