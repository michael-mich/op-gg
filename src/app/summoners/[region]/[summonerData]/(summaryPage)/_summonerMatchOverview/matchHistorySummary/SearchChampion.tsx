import { useEffect, useMemo, useState } from 'react';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import type { TMatchProps } from '../SummonerMatchOverview';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';
import type { TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';
import type { TSetState } from '@/app/_types/tuples';
import { IoIosSearch } from 'react-icons/io';
import { FaCertificate } from 'react-icons/fa6';
import ChampionAvatar from '@/app/_components/ChampionAvatar';

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
  const [searchInput, setSearchInput] = useState('');
  const [championPlaceholderData, setChampionPlaceholderData] = useState<Array<TChampion> | undefined>([]);
  const championsListRef = useOutsideClick(displaySummonerList, setDisplaySummonerList);

  const queryClient = useQueryClient();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const allChampionsMatchHistorySummary: Array<TMatchHistorySummary> | undefined = queryClient.getQueryData([
    'summonerMatchHistorySummary',
    summonerPuuid,
    '0',
    matchHistoryCount
  ]);

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

  const sortChampionsInHistoryMatchOrder = (champions: Array<TChampion> | undefined) => {
    return champions?.sort((a, b) => {
      const championA = matchHistorySummaryData?.championIds?.indexOf(a.key) || 0;
      const championB = matchHistorySummaryData?.championIds?.indexOf(b.key) || 0;
      return championA - championB;
    })
  }

  const filterChampionsBySearchTerm = (champions: Array<TChampion> | undefined) => {
    return champions?.filter((champion) => {
      const cleanChampionName = champion.name.toLowerCase().replaceAll('\'', '').replaceAll(' ', '');
      const cleanSearchTerm = searchInput.toLowerCase().replaceAll(' ', '');
      return cleanChampionName.includes(cleanSearchTerm);
    });
  }

  const sortedRecentlyPlayedChampions = sortChampionsInHistoryMatchOrder(recentlyPlayedChampions);
  const searchedRecentlyPlayedChampions = filterChampionsBySearchTerm(sortedRecentlyPlayedChampions);

  const sortedChampionPlaceholderData = sortChampionsInHistoryMatchOrder(championPlaceholderData);
  const searchedChampionPlaceholderData = filterChampionsBySearchTerm(sortedChampionPlaceholderData);

  const displayedChampions = searchedRecentlyPlayedChampions && searchedRecentlyPlayedChampions?.length > 0 ?
    searchedRecentlyPlayedChampions : searchedChampionPlaceholderData;

  useEffect(() => {
    if (recentlyPlayedChampions && recentlyPlayedChampions.length > 0) {
      setChampionPlaceholderData([...recentlyPlayedChampions]);
    }
  }, [allChampionsMatchHistorySummary]);

  return (
    <div
      ref={championsListRef}
      className='relative flex items-center gap-2 rounded bg-almostWhite 
    dark:bg-darkMode-darkBlue py-0.5 px-2'
    >
      <IoIosSearch className='size-6 text-secondGray' />
      <input
        onClick={handleDisplaySummonerList}
        onFocus={handleDisplaySummonerList}
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        className={`${isPending && 'pointer-events-none'} w-full text-xs bg-transparent 
        outline-none placeholder:opacity-50`}
        type='text'
        placeholder='Search a champion'
      />
      {displaySummonerList && (
        <div
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
            {displayedChampions?.map((champion) => (
              <li
                className={`${champion.key === markedChampionId && 'pointer-events-none bg-almostWhite dark:bg-darkMode-darkBlue'} 
                ${isPending && 'pointer-events-none'} ${addOpacityStyle(champion.key) && 'opacity-70'} 
                transition-all border-bottom-theme last-of-type:border-b-0 py-1.5 px-2.5`}
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
                  <ChampionAvatar
                    championData={champion}
                    imageSize='smallMedium'
                    isRoundedImage
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