'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type { TSummonerLiveGameData } from '@/app/_types/apiTypes/customApiTypes';
import GameTimer from './GameTimer';
import TableHead from './TableHead';
import SummonerRank from './SummonerRank';
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
  const { continentLink, regionLink } = useCurrentRegion() || {};

  const { data: newestGameVersion } = useGameVersionQuery();

  const {
    data: liveGameData,
    isSuccess: isLiveGameSuccess,
    isPending: isLiveGamePending,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['liveGame', summonerPuuid],
    queryFn: () => {
      return fetchApi<TSummonerLiveGameData>(
        riotGamesCustomRoutes.summonerLiveGame(summonerPuuid, regionLink, continentLink)
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
              Ranked Solo/Duo
            </span>
            <span className='text-xs px-2 border-r border-r-black dark:border-r-[#393948]'>
              Summoner&apos;s Rift
            </span>
            <GameTimer gameLength={liveGameData?.gameLength} />
          </div>
          {liveGameData?.teams?.map((team) => {
            const blueTeam = team.teamType === 'blue';

            return (
              <table
                className='w-full'
                aria-label={`live data of ${blueTeam ? 'blue' : 'red'} team`}
                key={team.teamType}
              >
                <TableHead blueTeam={blueTeam} />
                <tbody>
                  {team.teamParticipants.map((summoner, summonerIndex) => {
                    const isActiveRuneDisplayed = activeRuneDisplay.clicked && activeRuneDisplay.summonerIndex === summonerIndex && activeRuneDisplay.teamType === team.teamType;

                    return (
                      <React.Fragment key={`${summoner.teamId}-${summoner.summonerNameAndTagLine?.name}-${summonerIndex}`}>
                        <tr className={`${blueTeam ? 'after:bg-blue' : 'after:bg-red'} border-t border-t-almostWhite                       
                        dark:border-t-darkMode-darkBlue relative after:absolute after:left-0 after:z-10 after:w-1 after:h-full`}
                        >
                          <td className='text-xss py-2 px-3'>
                            <ChampionProfile summoner={summoner} displaySummonerData />
                          </td>
                          <SummonerRank summoner={summoner} />
                          <ToggleRunesButton
                            activeRuneDisplay={activeRuneDisplay}
                            setActiveRuneDisplay={setActiveRuneDisplay}
                            isActiveRuneDisplayed={isActiveRuneDisplayed}
                            summonerIndex={summonerIndex}
                            teamType={team.teamType}
                          />
                          <td className='py-2 px-3'>
                            {summoner.bannedChampion && (
                              <Image
                                className='size-8 rounded'
                                src={`${imageEndpoints.championImage(newestGameVersion)}${summoner.bannedChampion?.image}`}
                                width={32}
                                height={32}
                                alt={summoner.bannedChampion?.name || ''}
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