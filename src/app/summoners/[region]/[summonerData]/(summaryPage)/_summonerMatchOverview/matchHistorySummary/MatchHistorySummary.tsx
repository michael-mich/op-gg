'use client';

import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import type { TSetState } from '@/app/_types/tuples';
import type { TRecetGames } from '@/app/_types/apiTypes/customApiTypes';
import GameStatsSummary from './GameStatsSummary';
import TopChampions from './TopChampions';
import PreferredPosition from './PreferredPosition';
import SearchChampion from './SearchChampion';
import { CircularProgress } from '@nextui-org/react';

type Props = {
  markedChampionId: string;
  setMarkedChampionId: TSetState<string>;
  matchHistoryStartIndex: number;
}

const MatchHistorySummary = ({ markedChampionId, setMarkedChampionId, matchHistoryStartIndex }: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { continentLink } = useCurrentRegion() || {};

  const matchHistoryCount = matchHistoryStartIndex === 0 ? 10 : matchHistoryStartIndex + 10;
  const {
    data: matchHistorySummaryData,
    isPending,
    isSuccess,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['summonerMatchHistorySummary', summonerPuuid, markedChampionId, matchHistoryCount],
    queryFn: () => {
      return fetchApi<TRecetGames>(
        riotGamesCustomRoutes.matchHistorySummary(
          summonerPuuid,
          continentLink,
          markedChampionId,
          matchHistoryCount.toString()
        )
      );
    },
    placeholderData: (keepPreviousData) => keepPreviousData
  });

  return (
    <div className={`${isPending && 'flex items-center justify-center py-12'} w-full 
    h-fit bg-white dark:bg-darkMode-mediumGray rounded`}
    >
      {isPending ? (
        <CircularProgress aria-label={`loading summoner summary of 0 recent games`} />
      ) : isSuccess ? (
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-1'>
            <span className='text-sm pl-2'>Recent Games</span>
            <SearchChampion
              matchHistorySummaryData={matchHistorySummaryData}
              setMarkedChampionId={setMarkedChampionId}
            />
          </div>
          <div className='grid grid-cols-3 py-2 px-3'>
            <GameStatsSummary matchHistorySummaryData={matchHistorySummaryData} />
            <TopChampions matchHistorySummaryData={matchHistorySummaryData} />
            <PreferredPosition matchHistorySummaryData={matchHistorySummaryData} />
          </div>
        </>
      ) : (
        <p>error</p>
      )}
    </div >
  );
}

export default MatchHistorySummary;