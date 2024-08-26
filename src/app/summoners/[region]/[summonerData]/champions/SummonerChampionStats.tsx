'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerChampionStats } from '@/app/_lib/api/riotGamesApi/summonerChampionStats';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import type { TSummonerChampionStats, TChampionStats } from '@/app/_types/apiTypes';
import type { TSummonerPageParams } from '@/app/_types/types';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar } from '@nextui-org/react';

const columns = [
  '#',
  'Champion',
  'Played',
  'KDA',
  'Gold',
  'CS',
  'Max Kills',
  'Max Deaths',
  'Average Damage Dealt',
  'Double Kill',
  'Triple Kill',
  'Quadra Kill',
  'Penta Kill'
];

const SummonerChampionStats = () => {
  const params = useParams<TSummonerPageParams>();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = getRegionDataFromParams(params.region);

  const { data: championsStats, refetch: refetchTestMatch, isError } = useQuery({
    enabled: false,
    queryKey: ['matchStats', 'summonerPage'],
    queryFn: () => getSummonerChampionStats(currentRegionData, summonerPuuid)
  });

  const formatKillStat = (stat: TSummonerChampionStats, key: keyof Omit<TChampionStats, 'championName'>): number | string => {
    return stat[key] === 0 ? '' : stat[key];
  }

  useEffect(() => {
    if (summonerPuuid) {
      refetchTestMatch();
    }
  }, [summonerPuuid]);

  if (isError) {
    return <p>error</p>
  }

  return (
    <div className='custom-table-wrapper'>
      <Table aria-label='table with champion stats'>
        <TableHeader>
          {columns.map((column, index) =>
            <TableColumn
              className={`${(index >= 2) && 'text-center'} relative`}
              key={column}
            >
              <div className={`${index >= 8 && 'w-10 overflow-hidden text-ellipsis'}`}>
                {column}
              </div>
              <div className='hidden absolute -top-full left-1/2 -translate-x-1/2 z-[2] bg-black py-2 px-2.5'>
                <span className='text-xs text-white font-normal'>{column}</span>
                <div className='absolute top-6 left-1/2 -translate-x-1/2 rotate-45 z-[1] size-4 bg-black'></div>
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No champion stats to display'}>
          {championsStats
            ?
            championsStats?.map((stat, index) => {
              const numberKda = parseFloat(stat.kda.kda);

              return (
                <TableRow
                  className='group'
                  key={stat.championName}
                >
                  <TableCell className='table-cell-hover-bg'>{index++ + 1}</TableCell>
                  <TableCell className='table-cell-hover-bg'>
                    <div className='flex items-center gap-2'>
                      <Avatar
                        src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${stat.championName}.png`}
                        size='sm'
                      />
                      <span className='text-xs font-bold'>{stat.championName}</span>
                    </div>
                  </TableCell>
                  <TableCell className='flex items-center gap-2 h-[61.5px] table-cell-hover-bg '>
                    <div className='relative flex items-center justify-end w-[90px] h-5 bg-red-500 rounded'>
                      <div
                        className={`${stat.played.wonMatches === 0 && 'hidden'} absolute left-0 top-1/2 -translate-y-1/2 z-[1] w-[${stat.played.winRatio}%] ${stat.played.lostMatches === 0 ? 'rounded' : 'rounded-l'} h-full bg-blue`}
                        style={{ width: `${stat.played.winRatio}%` }}
                      >
                        <span className='absolute top-1/2 -translate-y-1/2 text-xs text-white pl-1'>
                          {stat.played.wonMatches}W
                        </span>
                      </div>
                      <span className={`${stat.played.lostMatches === 0 && 'hidden'} text-xs text-white pr-1`}>
                        {stat.played.lostMatches}L
                      </span>
                    </div>
                    <span className={`${stat.played.winRatio >= 60 ? 'text-red-500' : 'text-[#57646F] dark:text-darkMode-lighterGray'} text-xs`}>
                      {stat.played.winRatio}%
                    </span>
                  </TableCell>
                  <TableCell className='table-cell-hover-bg'>
                    <span className={`${numberKda >= 6.0 ? 'text-[#ff8200]' : numberKda >= 4.0 ? 'text-[#0090fb]' : numberKda >= 3.0 ? 'text-[#00bba3]' : 'text-lightMode-secondMediumGray dark:text-darkMode-lighterGray'} block text-center text-xs font-bold`}>
                      {stat.kda.kda}
                    </span>
                    <span className='w-[85px] table-cell text-xss'>{stat.kda.averageKills} / {stat.kda.averageAssists} / {stat.kda.averageDeaths}</span>
                  </TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stat.totalGold}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stat.minions.averageKilledMinions} ({stat.minions.minionsPerMinute})</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stat.maxKills}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stat.maxDeaths}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stat.averageDamageDealt}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stat, 'doubleKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stat, 'tripleKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stat, 'quadraKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stat, 'pentaKills')}</TableCell>
                </TableRow>
              )
            })
            :
            []
          }
        </TableBody>
      </Table>
    </div>
  );
}

export default SummonerChampionStats;