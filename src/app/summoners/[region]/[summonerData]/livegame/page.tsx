'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getSummonerLiveGameData } from '@/app/_lib/api/riotGamesApi/summonerLiveGameData';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { calculateWinRate, formatTierName, getRankedEmblem } from '@/app/_lib/utils/rank';
import GameTimer from './GameTimer';
import SummonerCurrentGameDetails from './SummonerCurrentGameDetails';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

const columns = [
  '',
  '',
  `S${new Date().getFullYear()}`,
  'Ranked Ratio',
  'Runes',
  'Ban'
];

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

  const getColorBasedOnWinRatio = (winRatio: number, useageType: 'bg' | 'text'): string => {
    if (winRatio > 70) {
      return `${useageType}-orange`;
    }
    else if (winRatio > 60) {
      return `${useageType}-secondLightBlue`;
    }
    else if (winRatio > 50) {
      return `${useageType}-mediumGreen`;
    }
    else {
      return `${useageType}-lightMode-secondLighterGray dark:${useageType}-darkMode-lighterGray`
    };
  }

  return (
    isLiveGameSuccess && (
      <div className='bg-white dark:bg-darkMode-mediumGray rounded py-2 mb-2'>
        <div className='flex items-center px-2 mb-2'>
          <span className='text-sm font-bold border-r border-r-black dark:border-r-[#393948] pr-2'>
            Ranked Solo/Duo
          </span>
          <span className='text-sm px-2 border-r border-r-black dark:border-r-[#393948]'>
            Summoner's Rift
          </span>
          <GameTimer gameLength={liveGameData?.gameLength} />
        </div>
        {teams?.map((team) => team.map(([teamName, teamData]) => {
          const blueTeam = teamName === 'blueTeam';
          const blueText = blueTeam ? 'text-blue' : 'text-red';

          return (
            <div className='custom-table-wrapper' key={teamName}>
              <Table aria-label={`live data of ${blueTeam ? 'blue' : 'red'} team`}>
                <TableHeader>
                  {columns.map((column, index) => (
                    <TableColumn
                      className={`${index === 0 ? 'flex items-center gap-2 max-w-[370px]' : 'text-center'} 
                      ${index === 2 ? 'w-[132px]' : index === 3 ? 'w-[124px]' : 'w-auto'}`}
                      key={index}
                    >
                      {index === 0 ? (
                        <>
                          <span className={`${blueText} font-bold`}>{blueTeam ? 'Blue' : 'Red'} Team</span>
                          <div className='flex items-center gap-1'>
                            <span className={`${blueText} font-normal`}>Tier Average:</span>
                            <span className={`${blueText} font-bold`}>Diamond</span>
                          </div>
                        </>
                      ) : (
                        column
                      )}
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {teamData.map((data, index) => {
                    const totalPlayedGames = data.rank ? data.rank?.losses + data.rank?.wins : 0;
                    const winRatio = calculateWinRate(data.rank);

                    return (
                      <TableRow
                        className={`${blueTeam ? 'after:bg-blue' : 'after:bg-red'} ${index !== 0 && 'relative border-t border-t-black'} relative after:absolute after:left-0 after:z-10 after:w-1 after:h-full`}
                        key={index}
                      >
                        <TableCell className='w-[370px]'>
                          <SummonerCurrentGameDetails data={data} />
                        </TableCell>
                        <TableCell className='pr-0'>
                          <Image
                            className='m-auto'
                            src={getRankedEmblem(data.rank) || ''}
                            width={15}
                            height={15}
                            alt={data.rank?.rank || ''}
                          />
                        </TableCell>
                        <TableCell className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray text-center pl-0'>
                          {formatTierName(data.rank)} ({data.rank?.leaguePoints}LP)
                        </TableCell>
                        <TableCell>
                          <div className='text-center'>
                            <span className={`${getColorBasedOnWinRatio(winRatio, 'text')} font-bold mr-0.5`}>
                              {calculateWinRate(data.rank)}%
                            </span>
                            <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                              ({totalPlayedGames} Played)
                            </span>
                          </div>
                          <div className='relative w-[100px] h-[6px] bg-lightGrayBackground mt-1'>
                            <div
                              className={`absolute left-0 z-10 h-full ${getColorBasedOnWinRatio(winRatio, 'bg')}`}
                              style={{ width: `${winRatio}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell>cell</TableCell>
                        <TableCell>
                          <Image
                            src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${data.bannedChampion?.image}`}
                            width={50}
                            height={50}
                            alt={data.bannedChampion?.name || ''}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )
        }))}
      </div >
    )
  );
}

export default Page;