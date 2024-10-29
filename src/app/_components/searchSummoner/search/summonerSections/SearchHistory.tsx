import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { setLocalStorageFavoriteSummoners } from '@/app/_lib/features/localStorageFavoriteSummonersSlice';
import { getLocalStorageData } from '@/app/_lib/utils/utils';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import type { TSetState } from '@/app/_types/tuples';
import { LocalStorageKeys } from '@/app/_enums/enums';
import { CiWarning } from 'react-icons/ci';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaStar, FaRegStar } from 'react-icons/fa';

type Props = {
  handleMouseInteraction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setDisplaySummonerSections: TSetState<boolean>;
  localStorageSearchHistory: Array<TLocalStorageSummoner>;
  setLocalStorageSearchHistory: TSetState<Array<TLocalStorageSummoner>>;
  removeSummonerFromLocalStorage: (index: number, localeStorageKey: LocalStorageKeys) => Array<TLocalStorageSummoner>;
  displaySection: number;
}

const SearchHistory = ({
  handleMouseInteraction,
  setDisplaySummonerSections,
  localStorageSearchHistory,
  setLocalStorageSearchHistory,
  removeSummonerFromLocalStorage,
  displaySection
}: Props) => {
  const localStorageFavoriteSummoners = useAppSelector((state) => state.localStorageFavoriteSummoners.localStorageFavoriteSummoners);
  const dispatch = useAppDispatch();

  const favoriteSummonersArray = getLocalStorageData(LocalStorageKeys.FavoriteSummoners) || [];
  const searchHistoryArray = getLocalStorageData(LocalStorageKeys.SearchHistory) || [];

  const addFavoriteSummoner = (index: number): void => {
    favoriteSummonersArray.unshift(searchHistoryArray[index]);
    localStorage.setItem('favoriteSummoners', JSON.stringify(favoriteSummonersArray));
    dispatch(setLocalStorageFavoriteSummoners(favoriteSummonersArray));
  }

  const toggleFavoriteSummoner = (index: number): void => {
    const searchHistoryArray = getLocalStorageData(LocalStorageKeys.SearchHistory) || [];
    const searchHistoryData = searchHistoryArray[index];
    const favoriteSummonersArray = getLocalStorageData(LocalStorageKeys.FavoriteSummoners);
    const sameSummonerIndex = favoriteSummonersArray?.findIndex(
      (el) => el.summonerId === searchHistoryData.summonerId
    );

    if (sameSummonerIndex === -1) {
      addFavoriteSummoner(index);
    }
    else {
      dispatch(setLocalStorageFavoriteSummoners(removeSummonerFromLocalStorage(sameSummonerIndex!, LocalStorageKeys.FavoriteSummoners)));
    }
  }

  return (
    <div className={`${displaySection === 0 ? 'block max-h-[260px] overflow-scroll' : 'hidden'}`}>
      {localStorageSearchHistory.length === 0 ? (
        <div className='flex justify-center items-center flex-col gap-2 h-[260px] rounded-b'>
          <CiWarning className='size-6 text-[#c3cbd1] dark:text-darkMode-lighterGray' />
          <p className='text-xs text-[#aab2bc] dark:text-[#79788c]'>
            There is no summoner you seen recently
          </p>
        </div>
      ) : (
        localStorageSearchHistory.map((data, index) => {
          const favoriteSummoner = localStorageFavoriteSummoners.some((favSummoner) =>
            favSummoner.summonerId === data.summonerId
          );

          return (
            <Link
              onClick={() => setDisplaySummonerSections(false)}
              className='flex items-center justify-between py-2 px-3 last-of-type:rounded-b transition-colors 
            hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray'
              href={`/summoners/${data.regionShorthand?.toLowerCase()}/${data.summonerName}-${data.tagLine}`}
              key={`${data.summonerId}-${data.regionShorthand}`}
            >
              <div>
                <span className='bg-blue text-[11px] font-bold text-white rounded-sm py-[3px] px-1'>
                  {data.regionShorthand}
                </span>
                <span className='text-sm text-black dark:text-white ml-2 mr-1'>
                  {data.summonerName}
                </span>
                <span className='text-sm text-secondGray dark:text-mediumGrayText'>
                  #{data.tagLine}
                </span>
              </div>
              <div>
                <button
                  onClick={(e) => {
                    handleMouseInteraction(e);
                    toggleFavoriteSummoner(index);
                  }}
                  className='mr-3'
                  type='button'
                >
                  {favoriteSummoner ? (
                    <FaStar className='size-5 text-yellow' />
                  ) : (
                    <FaRegStar className='size-5 text-[#767d88]' />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    handleMouseInteraction(e);
                    setLocalStorageSearchHistory(removeSummonerFromLocalStorage(index, LocalStorageKeys.SearchHistory));
                  }}
                  type='button'
                >
                  <TiDeleteOutline className='size-5 text-[#767d88]' />
                </button>
              </div>
            </Link>
          )
        })
      )}
    </div>
  );
}

export default SearchHistory;