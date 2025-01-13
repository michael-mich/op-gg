'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import { checkQueueType } from '../_utils/utils';
import { findChampionById } from '../_utils/utils';
import type { TDetailedLiveGame } from '@/app/_types/apiTypes/customApiTypes';
import GameTimer from './GameTimer';
import TableHead from './TableHead';
import SummonerPerformance from './SummonerPerformance';
import ToggleRunesButton from './ToggleRunesButton';
import SummonerRunes from './_summonerRunes/SummonerRunes';
import SummonerInactive from './SummonerInactive';
import ChampionProfile from '../_components/championProfile/ChampionProfile';
import { CircularProgress } from '@nextui-org/react';

export type TActiveRuneDisplay = {
  clicked: boolean;
  summonerIndex: number;
  teamType: string;
}

const Page = () => {
  const [activeRuneDisplay, setActiveRuneDisplay] = useState<TActiveRuneDisplay>({
    clicked: false,
    summonerIndex: 0,
    teamType: ''
  });
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { regionLink } = useCurrentRegion() || {};

  const { data: newestGameVersion } = useGameVersionQuery();
  const { data: championData } = useChampionDataQuery();

  const {
    data: liveGameData,
    isSuccess: isLiveGameSuccess,
    isPending: isLiveGamePending,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['liveGame', summonerPuuid],
    queryFn: () => {
      return fetchApi<TDetailedLiveGame>(
        riotGamesCustomRoutes.summonerLiveGame(summonerPuuid, regionLink)
      );
    }
  });

  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded shadow-[0_0_5px_0_white] dark:shadow-none pt-2 mb-2'>
      {isLiveGamePending ? (
        <CircularProgress
          className='pb-[1.625rem] pt-4 m-auto'
          aria-label='loading to display summoners live game data'
        />
      ) : isLiveGameSuccess ? (
        <>
          <div className='flex items-center px-2 mb-2'>
            <span className='text-sm font-bold border-r border-r-black dark:border-r-[#393948] pr-2'>
              {checkQueueType(liveGameData?.gameQueueConfigId)}
            </span>
            <span className='text-xs px-2 border-r border-r-black dark:border-r-[#393948]'>
              Summoner&apos;s Rift
            </span>
            <GameTimer gameLength={liveGameData?.gameLength} />
          </div>
          {liveGameData?.teams?.map((team) => {
            const isBlueTeam = team.teamType === 'blue';

            return (
              <table
                className='w-full'
                aria-label={`live data of ${isBlueTeam ? 'blue' : 'red'} team`}
                key={team.teamType}
              >
                <TableHead isBlueTeam={isBlueTeam} team={team} />
                <tbody>
                  {team.teamParticipants.map((summoner, summonerIndex) => {
                    const isActiveRuneDisplayed = activeRuneDisplay.clicked && activeRuneDisplay.summonerIndex === summonerIndex && activeRuneDisplay.teamType === team.teamType;
                    const foundBannedChampion = findChampionById(championData, summoner.bannedChampion?.championId);

                    return (
                      <React.Fragment key={`${summoner.teamId}-${summoner.riotId}-${summonerIndex}`}>
                        <tr className={`${isBlueTeam ? 'after:bg-blue' : 'after:bg-red'} border-t border-t-almostWhite                       
                        dark:border-t-darkMode-darkBlue relative after:absolute after:left-0 after:z-10 after:w-1 after:h-full`}
                        >
                          <td className='text-xss py-2 px-3'>
                            <ChampionProfile summoner={summoner} displaySummonerData />
                          </td>
                          <SummonerPerformance summoner={summoner} />
                          <ToggleRunesButton
                            activeRuneDisplay={activeRuneDisplay}
                            setActiveRuneDisplay={setActiveRuneDisplay}
                            isActiveRuneDisplayed={isActiveRuneDisplayed}
                            summonerIndex={summonerIndex}
                            teamType={team.teamType}
                          />
                          <td className='py-2 px-3'>
                            {summoner.bannedChampion?.championId !== -1 && (
                              <Image
                                className='size-8 rounded'
                                src={`${imageEndpoints.championImage(newestGameVersion)}${foundBannedChampion?.image.full}`}
                                width={32}
                                height={32}
                                placeholder='blur'
                                blurDataURL='/placeholder/question-mark.webp'
                                alt={foundBannedChampion?.name || ''}
                              />
                            )}
                          </td>
                        </tr>
                        {isActiveRuneDisplayed && (
                          <SummonerRunes summoner={summoner} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            );
          })}
        </>
      ) : (
        <SummonerInactive />
      )}
    </div>
  );
}

export default Page;