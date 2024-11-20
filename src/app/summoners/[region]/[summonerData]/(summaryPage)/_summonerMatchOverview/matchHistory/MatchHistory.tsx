'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import { calculateTimeUnit } from '@/app/_utils/utils';
import { checkQueueType } from './utils/utils';
import type { TDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import type { TMatchHistoryCount } from '../SummonerMatchOverview';
import type { TSetState } from '@/app/_types/tuples';
import { TimeUnit } from '@/app/_enums/enums';
import TimeSinceMatch from './TimeSinceMatch';
import Badges from './Badges';
import ChampionItems from './components/ChampionItems';
import ChampionProfile from '../../../_components/ChampionProfile';
import { CircularProgress } from '@nextui-org/react';
import { IoIosArrowDown } from "react-icons/io";

interface Props extends TMatchHistoryCount {
  markedChampionId: string;
  matchHistoryStartIndex: number;
  setMatchHistoryStartIndex: TSetState<number>;
}

const MatchHistory = ({ markedChampionId, matchHistoryCount, setMatchHistoryCount }: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { continentLink, regionLink } = useCurrentRegion() || {};

  const { data: newestGameVersion } = useGameVersionQuery();

  const { data: matchHistoryData, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    enabled: !!summonerPuuid,
    queryKey: ['summonerMatchHistory', summonerPuuid, markedChampionId],
    queryFn: ({ pageParam }) => {
      return fetchApi<Array<TDetailedMatchHistory>>(
        riotGamesCustomRoutes.detailedMatchHistory(
          summonerPuuid,
          continentLink,
          regionLink,
          markedChampionId,
          pageParam.toString(),
        )
      );
    },
    initialPageParam: 0,
    maxPages: 90,
    getNextPageParam: (_, __, lastPageParam) => lastPageParam + 10,
  });

  useEffect(() => {
    if (matchHistoryData?.pages) {
      setMatchHistoryCount(matchHistoryData?.pages.length * 10);
    }
    else {
      setMatchHistoryCount(10);
    }
  }, [summonerPuuid]);

  return (
    <div className='mt-2'>
      {matchHistoryData?.pages.map((page) => page?.map((match, matchIndex) => {
        const { currentSummoner, gameDuration, queueId } = match.info;

        const gameMinutes = calculateTimeUnit(gameDuration, TimeUnit.Minutes);
        const gameSeconds = calculateTimeUnit(gameDuration, TimeUnit.Seconds);

        return (
          <div className='flex mt-2 first-of-type:mt-0' key={matchIndex}>
            <div
              className={`${currentSummoner?.gameEndedInEarlySurrender ? 'border-l-lightMode-secondLighterGray dark:border-l-darkMode-lighterGray bg-lightMode-lightGray dark:bg-darkMode-darkGray' : currentSummoner?.win ? 'bg-lightBlue dark:bg-darkBlue border-l-blue' : 'bg-lightRed dark:bg-darkRed border-l-red'} 
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
              <div className='flex-1 self-center'>
                <div className='flex'>
                  <ChampionProfile summoner={match.info.currentSummoner} size='large' />
                  <div className='flex flex-col w-[108px] ml-3'>
                    <div className='text-[15px] font-bold dark:text-darkMode-secondMediumGray'>
                      <span className='text-lightMode-black dark:text-white'>{currentSummoner?.kills}</span> / <span className='text-red'>{currentSummoner?.deaths}</span> / <span className='text-lightMode-black dark:text-white'>{currentSummoner?.assists}</span>
                    </div>
                    <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray text-xs'>
                      {currentSummoner?.kda?.toFixed(2)}:1 KDA
                    </span>
                  </div>
                  <ul className={`${currentSummoner?.gameEndedInEarlySurrender ? 'border-l-lightMode-thirdLighterGray dark:border-l-lightGrayBackground' : currentSummoner?.win ? 'border-l-lightMode-blue dark:border-l-darkMode-mediumBlue' : 'border-l-lightMode-red dark:border-l-darkMode-red'} 
                    flex flex-col gap-1 h-[58px] text-xss text-lightMode-secondLighterGray dark:text-darkMode-lighterGray border-l pl-2`}
                  >
                    <li className='text-xs leading-3 text-red'>P/Kill {currentSummoner?.killParticipation}%</li>
                    <li>CS {currentSummoner?.minions?.totalMinions} ({currentSummoner?.minions?.minionsPerMinute})</li>
                    <li>{currentSummoner?.rank?.tier}</li>
                  </ul>
                </div>
                <div className='flex items-center gap-2 mt-[2px]'>
                  <ChampionItems
                    items={currentSummoner?.items}
                    win={currentSummoner?.win}
                    earlySurrender={currentSummoner?.gameEndedInEarlySurrender}
                  />
                  <Badges currentSummoner={currentSummoner} />
                </div>
              </div>
              <div className='flex gap-2 w-[168px]'>
                {match.info.segregatedTeams.map((team) => (
                  <div className='flex flex-col gap-0.5' key={team.teamType}>
                    {team.teamParticipants.map((summoner, summonerIndex) => {
                      const currentSummoner = summonerPuuid === summoner?.puuid;

                      return (
                        <div
                          className='flex items-center gap-1 w-fit'
                          key={`${summoner?.puuid}-${summonerIndex}`}
                        >
                          <Image
                            className={`${currentSummoner ? 'rounded-image' : 'rounded'} size-4`}
                            src={`${imageEndpoints.championImage(newestGameVersion)}${summoner?.championData?.image || `${summoner?.championName}.png`}`}
                            width={16}
                            height={16}
                            alt={summoner?.championData?.name || ''}
                          />
                          <span className={`${currentSummoner ? 'text-black dark:text-white' : 'text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'} 
                            block max-w-[60px] text-xs overflow-hidden text-ellipsis whitespace-nowrap`}
                          >
                            {summoner?.riotIdGameName ? summoner.riotIdGameName : summoner?.summonerName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <button
              className={`${currentSummoner?.win ? 'bg-lightMode-blue dark:bg-darkMode-mediumBlue' : 'bg-lightMode-red dark:bg-darkMode-red'} 
              flex items-end justify-center w-10 rounded-tr-[5px] rounded-br-[5px] p-2`}
              type='button'
            >
              <IoIosArrowDown className={`${currentSummoner?.win ? 'text-blue' : 'text-red'} size-5`} />
            </button>
          </div>
        );
      }))}
      {((matchHistoryCount < 100 || isFetchingNextPage) && matchHistoryData?.pages && matchHistoryData?.pages?.length > 0) && (
        <button
          onClick={() => {
            fetchNextPage();
            setMatchHistoryCount(prev => prev + 10);
          }}
          className={`${isFetchingNextPage && 'pointer-events-none'} flex justify-center w-full text-sm bg-white dark:bg-darkMode-mediumGray 
          border border-lightMode-thirdLighterGray dark:border-lightGrayBackground rounded py-2 mt-2`}
          type='button'
        >
          {isFetchingNextPage ? <CircularProgress aria-label='match history' size='sm' /> : 'Show more'}
        </button>
      )}
    </div>
  );
}

export default MatchHistory;