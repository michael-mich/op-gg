'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
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
}

const MatchHistorySummary = ({
  markedChampionId,
  matchHistoryCount,
  ...props
}: Props) => {
  const { resolvedTheme } = useTheme();
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
    <div className='w-full h-fit bg-white dark:bg-darkMode-mediumGray rounded'>
      <div className='flex items-center justify-between h-[35px] border-bottom-theme px-1'>
        <span className='text-sm pl-2'>Recent Games</span>
        <SearchChampion
          matchHistorySummaryData={matchHistorySummaryData}
          markedChampionId={markedChampionId}
          matchHistoryCount={matchHistoryCount}
          {...props}
        />
      </div>
      {isMatchHistorySummaryPending ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <CircularProgress aria-label={`loading summoner summary of ${matchHistoryCount} recent games`} />
        </div>
      ) : (isSuccess
        && matchHistorySummaryData?.gameAmounts.totalGames
        && matchHistorySummaryData.gameAmounts.totalGames > 0
      ) ? (
        <>
          <div className='grid grid-cols-3 py-2 px-3'>
            <GameStatsSummary matchHistorySummaryData={matchHistorySummaryData} />
            <TopChampions matchHistorySummaryData={matchHistorySummaryData} />
            <PreferredPosition matchHistorySummaryData={matchHistorySummaryData} />
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center py-8'>
          <Image
            src={`https://s-lol-web.op.gg/static/images/site/summoner/summoner_no_result_recent${resolvedTheme === 'dark' ? '_dark' : ''}.png`}
            width={270}
            height={120}
            alt='Not found data'
          />
          <p className='text-sm text-secondGray dark:text-mediumGrayText'>
            There are no recent match records
          </p>
        </div>
      )}
    </div >
  );
}

export default memo(MatchHistorySummary);