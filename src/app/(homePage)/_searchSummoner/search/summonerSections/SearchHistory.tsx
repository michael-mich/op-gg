import Link from 'next/link';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import type { TLocalStorageSummonerSetState } from '@/app/_types/unions';
import { CiWarning } from 'react-icons/ci';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaStar, FaRegStar } from 'react-icons/fa';

type Props = {
  localStorageSearchHistory: Array<TLocalStorageSummoner>;
  setLocalStorageSearchHistory: TLocalStorageSummonerSetState;
  localStorageFavoriteSummoners: Array<TLocalStorageSummoner>;
  setLocalStorageFavoriteSummoners: TLocalStorageSummonerSetState;
  getLocalStorageData: (localStorageKey: string) => Array<TLocalStorageSummoner>;
  removeSummoner: (index: number, localeStorageKey: string, setState: TLocalStorageSummonerSetState) => void;
  displaySection: number;
}

const SearchHistory = ({
  localStorageSearchHistory,
  setLocalStorageSearchHistory,
  localStorageFavoriteSummoners,
  setLocalStorageFavoriteSummoners,
  getLocalStorageData,
  removeSummoner,
  displaySection
}: Props) => {
  const addFavoriteSummoner = (index: number): void => {
    const favoriteSummonersArray = getLocalStorageData('favoriteSummoners');
    favoriteSummonersArray.unshift(getLocalStorageData('searchHistory')[index]);
    localStorage.setItem('favoriteSummoners', JSON.stringify(favoriteSummonersArray));
    setLocalStorageFavoriteSummoners(favoriteSummonersArray);
  }

  const toggleFavoriteSummoner = (index: number): void => {
    const searchHistoryData = getLocalStorageData('searchHistory')[index];
    const favoriteSummonersArray = getLocalStorageData('favoriteSummoners');
    const sameSummonerIndex = favoriteSummonersArray.findIndex(
      (el) => el.summonerId === searchHistoryData.summonerId
    );

    if (sameSummonerIndex === -1) {
      addFavoriteSummoner(index);
    }
    else {
      removeSummoner(sameSummonerIndex, 'favoriteSummoners', setLocalStorageFavoriteSummoners);
    }
  }

  return (
    <div className={`${displaySection === 0 ? 'block max-h-[260px] overflow-scroll' : 'hidden'}`}>
      {localStorageSearchHistory.length === 0
        ?
        <div className='flex justify-center items-center flex-col gap-2 h-[260px] rounded-b'>
          <CiWarning className='size-6 text-[#c3cbd1] dark:text-darkMode-lighterGray' />
          <p className='text-xs text-[#aab2bc] dark:text-[#79788c]'>
            There is no summoner you seen recently
          </p>
        </div>
        :
        localStorageSearchHistory.map((data, index) => {
          const favoriteSummoner = localStorageFavoriteSummoners.some((favSummoner) =>
            favSummoner.summonerId === data.summonerId);

          return (
            <Link
              className='flex items-center justify-between py-2 px-3 last-of-type:rounded-b transition-colors 
            hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray'
              href={`/summoners/${data.regionShorthand.toLowerCase()}/${data.summonerName}-${data.tagLine}`}
              key={data.summonerId}
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
                  onClick={(e) => { e.preventDefault(); toggleFavoriteSummoner(index); }}
                  className='mr-3'
                  type='button'
                >
                  {favoriteSummoner
                    ?
                    <FaStar className='size-5 text-[#ffb900]' />
                    :
                    <FaRegStar className='size-5 text-[#767d88]' />
                  }
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeSummoner(index, 'searchHistory', setLocalStorageSearchHistory);
                  }}
                  type='button'
                >
                  <TiDeleteOutline className='size-5 text-[#767d88]' />
                </button>
              </div>
            </Link>
          )
        })
      }
    </div>
  );
}

export default SearchHistory;