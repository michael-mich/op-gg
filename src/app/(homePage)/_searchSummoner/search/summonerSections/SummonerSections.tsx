import { useEffect, useState } from 'react';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import type { TLocalStorageSummonerSetState } from '@/app/_types/unions';
import SearchHistory from './SearchHistory';
import FavoriteSummoners from './FavoriteSummoners';

type Props = {
  displaySummonerSections: boolean;
  getLocalStorageData: (localeStorageKey: string) => Array<TLocalStorageSummoner>;
}

const SummonerSections = ({ displaySummonerSections, getLocalStorageData }: Props) => {
  const [localStorageSearchHistory, setLocalStorageSearchHistory] = useState<Array<TLocalStorageSummoner>>([]);
  const [localStorageFavoriteSummoners, setLocalStorageFavoriteSummoners] = useState<Array<TLocalStorageSummoner>>([]);
  const [displaySection, setDisplaySection] = useState(0);

  const removeSummoner = (index: number, localeStorageKey: string, setState: TLocalStorageSummonerSetState): void => {
    const storageData = getLocalStorageData(localeStorageKey);
    storageData.splice(index, 1);
    localStorage.setItem(localeStorageKey, JSON.stringify(storageData));
    setState(storageData);
  }

  useEffect(() => {
    setLocalStorageSearchHistory(getLocalStorageData('searchHistory'));
    setLocalStorageFavoriteSummoners(getLocalStorageData('favoriteSummoners'));
  }, []);

  return (
    <div className={`${displaySummonerSections ? 'block' : 'hidden'} absolute top-[3.2rem] 
    left-0 z-10 w-full bg-white dark:bg-darkMode-mediumGray rounded-b`}
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
        localStorageSearchHistory={localStorageSearchHistory}
        setLocalStorageSearchHistory={setLocalStorageSearchHistory}
        localStorageFavoriteSummoners={localStorageFavoriteSummoners}
        setLocalStorageFavoriteSummoners={setLocalStorageFavoriteSummoners}
        getLocalStorageData={getLocalStorageData}
        removeSummoner={removeSummoner}
        displaySection={displaySection}
      />
      <FavoriteSummoners
        localStorageFavoriteSummoners={localStorageFavoriteSummoners}
        setLocalStorageFavoriteSummoners={setLocalStorageFavoriteSummoners}
        removeSummoner={removeSummoner}
        displaySection={displaySection}
      />
    </div>
  );
}

export default SummonerSections;