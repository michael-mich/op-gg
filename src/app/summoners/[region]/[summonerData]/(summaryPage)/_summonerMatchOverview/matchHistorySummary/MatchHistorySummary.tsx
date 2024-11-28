'use client';

import { memo } from 'react';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import type { TMatchProps } from '../SummonerMatchOverview';
import type { TSetState } from '@/app/_types/tuples';
import type { TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';
import GameStatsSummary from './GameStatsSummary';
import TopChampions from './TopChampions';
import PreferredPosition from './PreferredPosition';
import SearchChampion from './SearchChampion';
import { CircularProgress } from '@nextui-org/react';

interface Props extends Omit<TMatchProps, 'markedMatchIndexes'> {
  setMarkedChampionId: TSetState<string>;
  setChampionSearchMode: TSetState<boolean>;
}

const MatchHistorySummary = ({
  markedChampionId,
  matchHistoryCount,
  ...props
}: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { continentLink } = useCurrentRegion() || {};

  const {
    data: matchHistorySummaryData,
    isPending: isMatchHistorySummaryPending,
    isSuccess
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['summonerMatchHistorySummary', summonerPuuid, markedChampionId, matchHistoryCount],
    queryFn: () => {
      return fetchApi<TMatchHistorySummary>(
        riotGamesCustomRoutes.matchHistorySummary(
          summonerPuuid,
          continentLink,
          markedChampionId,
          matchHistoryCount.toString()
        )
      );
    }
  });

  return (
    <div className={`${isMatchHistorySummaryPending && 'flex items-center justify-center py-12'} 
    w-full h-fit bg-white dark:bg-darkMode-mediumGray rounded`}
    >
      {isMatchHistorySummaryPending ? (
        <CircularProgress aria-label={`loading summoner summary of 0 recent games`} />
      ) : isSuccess ? (
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-1'>
            <span className='text-sm pl-2'>Recent Games</span>
            <SearchChampion
              matchHistorySummaryData={matchHistorySummaryData}
              markedChampionId={markedChampionId}
              matchHistoryCount={matchHistoryCount}
              {...props}
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

export default memo(MatchHistorySummary);