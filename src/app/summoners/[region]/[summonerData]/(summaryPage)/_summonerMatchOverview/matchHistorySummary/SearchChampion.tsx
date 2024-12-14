import { useMemo, useState } from 'react';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import type { TMatchProps } from '../SummonerMatchOverview';
import type { TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';
import type { TSetState } from '@/app/_types/tuples';
import { IoIosSearch } from 'react-icons/io';
import { FaCertificate } from "react-icons/fa6";

interface Props extends Omit<TMatchProps, 'markedMatchIndexes'> {
  matchHistorySummaryData: TMatchHistorySummary | undefined;
  setMarkedChampionId: TSetState<string>;
}

const SearchChampion = ({
  matchHistorySummaryData,
  markedChampionId,
  setMarkedChampionId,
  matchHistoryCount,
  isPending,
  setTransition,
  setMarkedMatchIndexes
}: Props) => {
  const [displaySummonerList, setDisplaySummonerList] = useState(false);
  const [searchedChampion, setSearchedChampion] = useState('');
  const championsListRef = useOutsideClick(displaySummonerList, setDisplaySummonerList);

  const { data: championData } = useChampionDataQuery();

  const handleDisplaySummonerList = () => {
    setDisplaySummonerList(true);
  }

  const resetStates = () => {
    setMarkedMatchIndexes({});
    setMarkedChampionId('0');
  }

  const addOpacityStyle = (championId: string) => {
    return markedChampionId === championId && isPending && matchHistoryCount > 10;
  }

  const recentlyPlayedChampions = useMemo(() => championData?.filter((champion) =>
    matchHistorySummaryData?.championIds?.some((id) => id === champion.key)
  ), [matchHistorySummaryData]);

  const searchFilteredChampions = recentlyPlayedChampions?.filter((champion) => {
    const cleanChampionName = champion.name.toLowerCase().replaceAll('\'', '');
    const cleanSearchTerm = searchedChampion.toLowerCase().replaceAll(' ', '');

    return cleanChampionName.includes(cleanSearchTerm);
  });

  return (
    <div className='relative flex items-center gap-2 rounded bg-almostWhite 
    dark:bg-darkMode-darkBlue py-0.5 px-2'
    >
      <IoIosSearch className='size-6 text-secondGray' />
      <input
        onClick={handleDisplaySummonerList}
        onFocus={handleDisplaySummonerList}
        onChange={(e) => setSearchedChampion(e.target.value)}
        value={searchedChampion}
        className='w-full text-xs bg-transparent outline-none placeholder:opacity-50'
        type='text'
        placeholder='Search a champion'
      />
      {displaySummonerList && (
        <div
          ref={championsListRef}
          className='absolute left-0 top-8 z-10 w-full max-h-[366px] overflow-y-auto 
          bg-white dark:bg-darkMode-mediumGray rounded transition-opacity'
        >
          <div className='text-sm border-bottom-theme py-1.5 px-2.5'>Recently played</div>
          <ul className='overflow-scroll'>
            <li className={`${markedChampionId === '0' && 'pointer-events-none bg-almostWhite dark:bg-darkMode-darkBlue'} 
            ${addOpacityStyle('0') && 'opacity-70'} transition-all border-bottom-theme py-1.5 px-2.5`}
            >
              <button
                onClick={() => {
                  setTransition(() => {
                    resetStates();
                  })
                }}
                className='flex items-center gap-2 text-xs'
                type='button'
              >
                <div className='bg-blue rounded-full aspect-square p-1.5'>
                  <FaCertificate className='size-3 text-white' />
                </div>
                All Champions
              </button>
            </li>
            {searchFilteredChampions?.map((champion) => (
              <li
                className={`${champion.key === markedChampionId && 'pointer-events-none bg-almostWhite dark:bg-darkMode-darkBlue'} 
                ${addOpacityStyle(champion.key) && 'opacity-70'} transition-all border-bottom-theme last-of-type:border-b-0 py-1.5 px-2.5`}
                key={champion.key}
              >
                <button
                  onClick={() => {
                    setTransition(() => {
                      setMarkedChampionId(champion.key);
                      setMarkedMatchIndexes({});
                    })
                  }}
                  className='flex items-center gap-2 text-xs'
                  type='button'
                >
                  <Image
                    className='size-6 rounded-full aspect-square'
                    src={`${imageEndpoints.championImage(newestGameVersion)}${champion.image.full}`}
                    width={24}
                    height={24}
                    alt={champion.name}
                  />
                  {champion.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchChampion;