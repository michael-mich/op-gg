import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { setLocalStorageFavoriteSummoners } from '@/app/_lib/features/localStorageFavoriteSummonersSlice';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import type { TSetState } from '@/app/_types/tuples';
import { FaStar } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';

type Props = {
  handleMouseInteraction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setDisplaySummonerSections: TSetState<boolean>;
  removeSummonerFromLocalStorage: (index: number, localeStorageKey: string) => Array<TLocalStorageSummoner>;
  displaySection: number;
}

const FavoriteSummoners = ({
  handleMouseInteraction,
  removeSummonerFromLocalStorage,
  setDisplaySummonerSections,
  displaySection
}: Props) => {
  const localStorageFavoriteSummoners = useAppSelector((state) => state.localStorageFavoriteSummoners.localStorageFavoriteSummoners);
  const dispatch = useAppDispatch();

  return (
    <div className={`${displaySection == 1 ? 'block max-h-[260px] overflow-scroll' : 'hidden'}`}>
      {localStorageFavoriteSummoners.length === 0
        ?
        <div className='flex justify-center items-center flex-col gap-2 h-[260px] rounded-b'>
          <FaStar className='size-6 text-[#ffb900]' />
          <div>
            <p className='flex gap-0.5 items-center text-xs text-[#aab2bc] dark:text-[#79788c]'>
              Add your <FaStar className='mb-1' /> favorite summoner for easy updates
              on the latest status
            </p>
          </div>
        </div>
        :
        localStorageFavoriteSummoners.map((data, index) => (
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
                  dispatch(setLocalStorageFavoriteSummoners(removeSummonerFromLocalStorage(index, 'favoriteSummoners')));
                }}
                type='button'
              >
                <TiDeleteOutline className='size-5 text-[#767d88]' />
              </button>
            </div>
          </Link>
        ))
      }
    </div>
  );
};

export default FavoriteSummoners;