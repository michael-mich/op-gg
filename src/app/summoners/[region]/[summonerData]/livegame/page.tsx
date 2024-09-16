'use client';

import Image from 'next/image';
import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { getSummonerLiveGameData } from '@/app/_lib/api/riotGamesApi/summonerliveGameData';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import GameTimer from './GameTimer';

const Page = () => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = useCurrentRegion();

  const {
    data: liveGameData,
    isSuccess: isLiveGameSuccess
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['liveGame', summonerPuuid],
    queryFn: () => getSummonerLiveGameData(currentRegionData, summonerPuuid),
    refetchOnWindowFocus: false
  });

  const teams = liveGameData?.teams.map((team) => Object.entries(team));

  return (
    isLiveGameSuccess && (
      <div className='bg-white dark:bg-darkMode-mediumGray rounded py-2 mb-2'>
        <div className='flex items-center px-2 mb-2'>
          <span className='text-sm  border-r border-r-black dark:border-r-[#393948] pr-2'>
            Ranked Solo/Duo
          </span>
          <span className='text-sm px-2 border-r border-r-black dark:border-r-[#393948]'>
            Summoner's Rift
          </span>
          <GameTimer gameLength={liveGameData?.gameLength} />
        </div>
        <div className='grid grid-cols-2'>
          {teams?.map((team) => team.map(([teamName, teamData]) => {
            const blueTeam = teamName === 'blueTeam';
            const teamColor = blueTeam ? 'text-blue' : 'text-red';

            return (
              <div className='' key={teamName}>
                <div className={`${blueTeam && 'border-r border-r-lightMode-lighterGray dark:border-r-darkMode-darkBlue'} 
                border-bottom-theme border-t border-t-lightMode-lighterGray dark:border-t-darkMode-darkBlue`}
                >
                  <div className='flex items-baseline py-2 pl-2'>
                    <span className={`${teamColor} text-xs font-bold`}>
                      {blueTeam ? 'Blue' : 'Red'} Team
                    </span>
                    <div className='flex-1 flex gap-1 ml-2'>
                      <span className={`${teamColor} text-xs`}>Tier Average:</span>
                      <span className={`${teamColor} text-xs font-bold`}> Diamond</span>
                    </div>
                    <span className='w-[150px] text-center text-xs text-[#7b7a8e]'>
                      S{new Date().getFullYear()}
                    </span>
                  </div>
                </div>
                <ul>
                  {teamData.map((data, index) => (
                    <li key={index}>
                      <div>
                        <div>
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${data.championData?.image}`}
                            width={50}
                            height={50}
                            alt={data.championData?.name || ''}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }))}
        </div>
      </div>
    )
  );
}

export default Page;