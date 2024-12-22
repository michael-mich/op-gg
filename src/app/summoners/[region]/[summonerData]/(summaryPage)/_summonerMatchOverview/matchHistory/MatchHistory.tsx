'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useInfiniteQuery, useIsFetching, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import { calculateTimeUnit } from '@/app/_utils/utils';
import { checkQueueType } from './utils/utils';
import type { TMatchProps } from '../SummonerMatchOverview';
import type {
  TDetailedMatchHistory,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';
import type { TSetState } from '@/app/_types/tuples';
import { TimeUnit } from '@/app/_enums/enums';
import TimeSinceMatch from './TimeSinceMatch';
import MatchDetails from './matchDetails/MatchDetails';
import Teams from './Teams';
import SummonerStats from './summonerStats/SummonerStats';
import PaginationButton from './PaginationButton';
import { IoIosArrowDown } from 'react-icons/io';

export type TMatchAndSummonerProps = {
  [key in 'summoner' | 'currentSummoner']?: TSummonerDetailedMatchHistory | undefined;
} & {
  match?: TDetailedMatchHistory;
};

interface Props extends Omit<TMatchProps, 'setTransition'> {
  setMatchHistoryCount: TSetState<number>;
}

const MatchHistory = ({
  markedChampionId,
  matchHistoryCount,
  setMatchHistoryCount,
  isPending,
  markedMatchIndexes,
  setMarkedMatchIndexes
}: Props) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { continentLink, regionLink } = useCurrentRegion() || {};
  const isFetchingSummonerAccount = useIsFetching({ queryKey: ['summonerAccount'] });
  const isFetchingSummonerProfile = useIsFetching({ queryKey: ['summonerProfile'] });

  const { data: matchHistoryData, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    enabled: !!summonerPuuid,
    queryKey: ['summonerMatchHistory', summonerPuuid],
    queryFn: ({ pageParam }) => {
      return fetchApi<Array<TDetailedMatchHistory>>(
        riotGamesCustomRoutes.detailedMatchHistory(
          summonerPuuid,
          continentLink,
          regionLink,
          pageParam.toString(),
        )
      );
    },
    initialPageParam: 0,
    maxPages: 20,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 20,
  });

  const filteredMatchHistory = useMemo(() => {
    return matchHistoryData?.pages.flatMap((page) => page?.filter((match) =>
      match.info.participants?.some((team) => team.teamParticipants.some((summoner) => {
        if (markedChampionId === '0') {
          return match;
        }
        else {
          return summoner?.championId.toString() === markedChampionId
            && summoner.puuid === summonerPuuid;
        }
      })))
    );
  }, [summonerPuuid, matchHistoryData, markedChampionId]);

  const handleMarkedMatchIndexes = (matchIndex: number) => {
    const newMarkedState = !markedMatchIndexes[matchIndex];
    if (newMarkedState) {
      setMarkedMatchIndexes({
        ...markedMatchIndexes,
        [matchIndex]: true,
      })
    }
    else {
      setMarkedMatchIndexes({
        ...markedMatchIndexes,
        [matchIndex]: newMarkedState
      })
    }
  }

  useEffect(() => {
    if (filteredMatchHistory && filteredMatchHistory?.length > 20) {
      queryClient.setQueryData(
        ['summonerMatchHistory', summonerPuuid],
        (oldData: typeof matchHistoryData) => ({
          ...oldData,
          pages: [oldData?.pages[0]],
          pageParams: [0],
        })
      );
      setMatchHistoryCount(20);
    }
  }, [pathname, summonerPuuid]);

  return (
    <div className='mt-2'>
      {filteredMatchHistory?.map((match, matchIndex) => {
        const { gameDuration, queueId } = match?.info || {};

        const currentSummoner = match?.info.participants?.flatMap((team) =>
          team.teamParticipants.filter((summoner) => summoner?.puuid === summonerPuuid)
        )[0];

        const gameMinutes = calculateTimeUnit(gameDuration, TimeUnit.Minutes);
        const gameSeconds = calculateTimeUnit(gameDuration, TimeUnit.Seconds);

        return (
          <React.Fragment key={matchIndex}>
            <div className={`${isPending && 'opacity-70'} transition-opacity flex mt-2 first-of-type:mt-0`}>
              <div className={`${currentSummoner?.gameEndedInEarlySurrender ? 'border-l-lightMode-secondLighterGray dark:border-l-darkMode-lighterGray bg-lightMode-lightGray dark:bg-darkMode-darkGray' : currentSummoner?.win ? 'bg-lightBlue dark:bg-darkBlue border-l-blue' : 'bg-lightRed dark:bg-darkRed border-l-red'} 
              flex-1 flex gap-2 border-l-[6px] rounded-tl-[5px] rounded-bl-[5px] py-1.5 px-2.5`}
              >
                <div className='w-[108px]'>
                  <div className='pb-2'>
                    <div className={`${currentSummoner?.gameEndedInEarlySurrender ? 'text-darkMode-lighterGray' : currentSummoner?.win ? 'text-blue' : 'text-red'} text-xs font-bold`}>
                      {checkQueueType(queueId)}
                    </div>
                    <TimeSinceMatch match={match} />
                  </div>
                  <div className={`${currentSummoner?.gameEndedInEarlySurrender ? 'bg-lightMode-thirdLighterGray dark:bg-lightGrayBackground' : currentSummoner?.win ? 'bg-lightMode-blue dark:bg-darkMode-mediumBlue' : 'bg-lightMode-red dark:bg-darkMode-red'} h-[1px] w-12`}></div>
                  <div className='pt-2'>
                    <div className='text-xs font-bold text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      {currentSummoner?.gameEndedInEarlySurrender ? 'Remake' : currentSummoner?.win ? 'Victory' : 'Defeat'}
                    </div>
                    <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      {gameMinutes}m {gameSeconds}s
                    </div>
                  </div>
                </div>
                <SummonerStats currentSummoner={currentSummoner} match={match} />
                <Teams match={match} />
              </div>
              {markedMatchIndexes[matchIndex] && (
                <MatchDetails match={match} currentSummoner={currentSummoner} />
              )}
            </React.Fragment>
          );
        })
      )}
      {(!isFetchingSummonerAccount && !isFetchingSummonerProfile)
        && (matchHistoryCount < 100 || isFetchingNextPage)
        && markedChampionId === '0'
        && matchHistoryData?.pages
        && matchHistoryData?.pages[matchHistoryData.pages.length - 1]?.length !== 0
        && (
          <PaginationButton
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            setMatchHistoryCount={setMatchHistoryCount}
          />
        )
      }
    </div>
  );
}

export default MatchHistory;