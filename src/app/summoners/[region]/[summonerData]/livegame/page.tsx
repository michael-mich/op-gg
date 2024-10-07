'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getSummonerLiveGameData } from '@/app/_lib/api/riotGamesApi/summonerLiveGameData';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import GameTimer from './GameTimer';
import TableHead from './TableHead';
import SummonerCurrentGameDetails from './SummonerCurrentGameDetails';
import SummonerRank from './SummonerRank';
import ToggleRunesButton from './ToggleRunesButton';
import SummonerRunes from './_summonerRunes/SummonerRunes';
import SummonerInactive from './SummonerInactive';
import { CircularProgress } from '@nextui-org/react';

export type TActiveRuneDisplay = {
  clicked: boolean;
  summonerIndex: number;
  teamName: string;
}

const Page = () => {
  const [activeRuneDisplay, setActiveRuneDisplay] = useState<TActiveRuneDisplay>({
    clicked: false,
    summonerIndex: 0,
    teamName: ''
  });
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegion = useCurrentRegion();

  const {
    data: liveGameData,
    isSuccess: isLiveGameSuccess,
    isPending: isLiveGamePending,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['liveGame', summonerPuuid],
    queryFn: () => getSummonerLiveGameData(currentRegion, summonerPuuid),
    refetchOnWindowFocus: false
  });

  const teams = useMemo(() => liveGameData?.teams.map((team) => Object.entries(team)), [isLiveGameSuccess, summonerPuuid]);

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
              Summoner's Rift
            </span>
            <GameTimer gameLength={liveGameData?.gameLength} />
          </div>
          {teams?.map((team) => team.map(([teamName, teamData]) => {
            const blueTeam = teamName === 'blueTeam';

            return (
              <table
                className='w-full'
                aria-label={`live data of ${blueTeam ? 'blue' : 'red'} team`}
                key={teamName}
              >
                <TableHead blueTeam={blueTeam} />
                <tbody>
                  {teamData.map((summoner, summonerIndex) => {
                    const isActiveRuneDisplayed = activeRuneDisplay.clicked && activeRuneDisplay.summonerIndex === summonerIndex && activeRuneDisplay.teamName === teamName;

                    return (
                      <React.Fragment key={`${summoner.teamId}-${summoner.summonerNameAndTagLine?.name}-${summonerIndex}`}>
                        <tr className={`${blueTeam ? 'after:bg-blue' : 'after:bg-red'} border-t border-t-almostWhite                       
                        dark:border-t-darkMode-darkBlue relative after:absolute after:left-0 after:z-10 after:w-1 after:h-full`}
                        >
                          <SummonerCurrentGameDetails summoner={summoner} />
                          <SummonerRank summoner={summoner} />
                          <ToggleRunesButton
                            activeRuneDisplay={activeRuneDisplay}
                            setActiveRuneDisplay={setActiveRuneDisplay}
                            isActiveRuneDisplayed={isActiveRuneDisplayed}
                            summonerIndex={summonerIndex}
                            teamName={teamName}
                          />
                          <td className='py-2 px-3'>
                            {summoner.bannedChampion && (
                              <Image
                                className='size-8 rounded'
                                src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${summoner.bannedChampion?.image}`}
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
          }))}
        </>
      ) : (
        <SummonerInactive />
      )}
    </div>
  );
}

export default Page;