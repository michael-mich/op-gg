'use client';

import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useAppSelector } from '@/app/_hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { routeHandlerEndpoints } from '@/app/_utils/routeHandlers';
import { calculateTimeUnit } from '@/app/_utils/utils';
import type { TDetailedMatchHistory } from '@/app/_types/customApiTypes/customApiTypes';
import { TimeUnit } from '@/app/_enums/enums';
import TimeSinceMatch from './TimeSinceMatch';
import SummonerChampion from './SummonerChampion';

type Props = {
  markedChampionId: string;
}

const MatchHistory = ({ markedChampionId }: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { continentLink } = useCurrentRegion() || {};

  const { data: matchHistoryData } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['curretSummonerMatchHistory', summonerPuuid, markedChampionId],
    queryFn: async () => {
      return await fetchApi<Array<TDetailedMatchHistory>>(
        routeHandlerEndpoints.detailedMatchHistory(summonerPuuid, continentLink, markedChampionId)
      );
    },
    retryDelay: 7000
  });

  return (
    <div className='mt-2'>
      {matchHistoryData?.map((match, matchIndex) => {
        const { win, teamEarlySurrendered } = match.info.currentSummoner || {};

        const gameMinutes = calculateTimeUnit(match.info.gameDuration, TimeUnit.Minutes);
        const gameSeconds = calculateTimeUnit(match.info.gameDuration, TimeUnit.Seconds);

        return (
          <div
            className={`${teamEarlySurrendered ? 'border-l-lightMode-secondLighterGray dark:border-l-darkMode-lighterGray bg-lightMode-lightGray dark:bg-darkMode-darkGray' : win ? 'bg-lightBlue dark:bg-darkBlue border-l-blue' : 'bg-lightRed dark:bg-darkRed border-l-red'} 
            flex border-l-[6px] rounded-tl-[5px] rounded-bl-[5px] py-1.5 px-2.5 mt-2 first-of-type:mt-0`}
            key={matchIndex}
          >
            <div>
              <div className='pb-2'>
                <div className={`${teamEarlySurrendered ? 'text-darkMode-lighterGray' : win ? 'text-blue' : 'text-red'} text-xs font-bold`}>
                  {match.info.gameType === 'MATCHED_GAME' && 'Ranked Solo/Duo'}
                </div>
                <TimeSinceMatch match={match} />
              </div>
              <div className={`${teamEarlySurrendered ? 'border-t-lightMode-thirdLighterGray dark:border-t-lightGrayBackground' : win ? 'border-t-[#d5e3ff] dark:border-t-[#2f436e]' : 'border-t-[#ffd8d9] dark:border-t-[#703c47]'} border-t pt-2`}>
                <div className='text-xs font-bold text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                  {teamEarlySurrendered ? 'Remake' : win ? 'Victory' : 'Defeat'}
                </div>
                <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                  {gameMinutes}m {gameSeconds}s
                </div>
              </div>
            </div>
            <SummonerChampion match={match} />
          </div>
        );
      })}
    </div>
  );
}

export default MatchHistory;