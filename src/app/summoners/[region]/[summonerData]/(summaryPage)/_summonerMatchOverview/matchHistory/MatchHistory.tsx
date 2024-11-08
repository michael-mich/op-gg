'use client';

import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useAppSelector } from '@/app/_hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { routeHandlerEndpoints } from '@/app/_utils/routeHandlers';
import { calculateTimeUnit } from '@/app/_utils/utils';
import type { TDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import { TimeUnit } from '@/app/_enums/enums';
import TimeSinceMatch from './TimeSinceMatch';
//import Badge from './Badge';
import ChampionItems from './components/ChampionItems';
import ChampionProfile from '@/app/_components/ChampionProfile';

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
        routeHandlerEndpoints.detailedMatchHistory(summonerPuuid, continentLink, markedChampionId, '20')
      );
    }
  });

  return (
    <div className='mt-2'>
      {matchHistoryData?.map((match, matchIndex) => {
        const { currentSummoner, gameDuration } = match.info;

        const gameMinutes = calculateTimeUnit(gameDuration, TimeUnit.Minutes);
        const gameSeconds = calculateTimeUnit(gameDuration, TimeUnit.Seconds);
        const earlySurrender = gameMinutes <= 5;

        const checkSummonerKills = () => {
          if (currentSummoner.pentaKills > 0) {
            return 'Penta';
          }
          else if (currentSummoner.quadraKills > 0) {
            return 'Quadra';
          }
          else if (currentSummoner.tripleKills > 0) {
            return 'Tripple';
          }
          else if (currentSummoner.doubleKills > 0) {
            return 'Double';
          }
        }

        return (
          <div
            className={`${earlySurrender ? 'border-l-lightMode-secondLighterGray dark:border-l-darkMode-lighterGray bg-lightMode-lightGray dark:bg-darkMode-darkGray' : currentSummoner.win ? 'bg-lightBlue dark:bg-darkBlue border-l-blue' : 'bg-lightRed dark:bg-darkRed border-l-red'} 
            flex border-l-[6px] rounded-tl-[5px] rounded-bl-[5px] py-1.5 px-2.5 mt-2 first-of-type:mt-0`}
            key={matchIndex}
          >
            <div>
              <div className='pb-2'>
                <div className={`${earlySurrender ? 'text-darkMode-lighterGray' : currentSummoner.win ? 'text-blue' : 'text-red'} text-xs font-bold`}>
                  {match.info.gameType === 'MATCHED_GAME' ? 'Ranked Solo/Duo' : 'All'}
                </div>
                <TimeSinceMatch match={match} />
              </div>
              <div className={`${earlySurrender ? 'border-t-lightMode-thirdLighterGray dark:border-t-lightGrayBackground' : currentSummoner.win ? 'border-t-[#d5e3ff] dark:border-t-[#2f436e]' : 'border-t-[#ffd8d9] dark:border-t-[#703c47]'} border-t pt-2`}>
                <div className='text-xs font-bold text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                  {earlySurrender ? 'Remake' : currentSummoner.win ? 'Victory' : 'Defeat'}
                </div>
                <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                  {gameMinutes}m {gameSeconds}s
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className='flex items-center gap-3'>
                  <ChampionProfile summoner={match.info.currentSummoner} size='large' />
                  <div className='flex flex-col'>
                    <div className='text-[15px] font-bold dark:text-darkMode-secondMediumGray'>
                      <span className='text-lightMode-black dark:text-white'>{currentSummoner.kills}</span> / <span className='text-red'>{currentSummoner.deaths}</span> / <span className='text-lightMode-black dark:text-white'>{currentSummoner.assists}</span>
                    </div>
                    <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray text-xs'>
                      {currentSummoner.challenges.kda.toFixed(2)}:1 KDA
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <ChampionItems
                  items={currentSummoner.items}
                  win={currentSummoner.win}
                  earlySurrender={earlySurrender}
                />
                {checkSummonerKills() && (
                  <span className='text-xs bg-red rounded-xl py-0.5 px-2'>
                    {checkSummonerKills()} Kill
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div >
  );
}

export default MatchHistory;