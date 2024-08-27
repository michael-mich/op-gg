'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerChampionStats } from '@/app/_lib/api/riotGamesApi/summonerChampionStats';
import { getFilteredChampions } from '@/app/_lib/api/riotGamesApi/riotGamesApi';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import type { TSummonerChampionStats, TChampionStats } from '@/app/_types/apiTypes';
import type { TSummonerPageParams } from '@/app/_types/types';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar } from '@nextui-org/react';

interface TDetailedChampionStats extends TSummonerChampionStats {
  championName: string | undefined;
  championImage: string | undefined;
}

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

  const { data: championsStats, refetch: refetchTestMatch, isError, isSuccess: isChampionStatsSuccess } = useQuery({
    enabled: false,
    queryKey: ['matchStats', 'summonerPage'],
    queryFn: () => getSummonerChampionStats(currentRegionData, summonerPuuid)
  });

  const { data: championsData, refetch: refetchChampionsData } = useQuery({
    enabled: false,
    queryKey: ['championData', 'summoner champions page'],
    queryFn: () => getFilteredChampions(championsStats)
  });

  const updateChampionStats = (): Array<TDetailedChampionStats> | undefined => {
    return championsStats?.map((stats) => {
      const matchingChampion = championsData?.find((data) => (
        data.key === stats.championId.toString()
      ));

      return {
        ...stats,
        championName: matchingChampion?.name,
        championImage: matchingChampion?.image.full
      }
    });
  }

  const detailedChampionStats = updateChampionStats();

  const formatKillStat = (stat: TSummonerChampionStats, key: keyof Omit<TChampionStats, 'championId'>): number | string => {
    return stat[key] === 0 ? '' : stat[key];
  }

  useEffect(() => {
    if (summonerPuuid) {
      refetchTestMatch();
    }
  }, [summonerPuuid]);

  useEffect(() => {
    if (isChampionStatsSuccess) {
      refetchChampionsData();
    }
  }, [isChampionStatsSuccess]);

  if (isError) {
    return <p>error</p>
  }

  return (
    <div className='custom-table-wrapper'>
      <Table aria-label='table with champion stats'>
        <TableHeader>
          {columns.map((column, index) =>
            <TableColumn
              className={`${(index >= 2) && 'text-center'} relative cursor-pointer`}
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
          {detailedChampionStats
            ?
            detailedChampionStats?.map((stats, index) => {
              const numberKda = parseFloat(stats.kda.kda);

              return (
                <TableRow
                  className='group'
                  key={stats.championId}
                >
                  <TableCell className='table-cell-hover-bg'>{index + 1}</TableCell>
                  <TableCell className='table-cell-hover-bg'>
                    <div className='flex items-center gap-2'>
                      <Avatar
                        src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${stats.championImage}`}
                        size='sm'
                      />
                      <span className='text-xs font-bold'>{stats.championName}</span>
                    </div>
                  </TableCell>
                  <TableCell className='flex items-center gap-2 h-[61.5px] table-cell-hover-bg '>
                    <div className='relative flex items-center justify-end w-[90px] h-5 bg-red-500 rounded'>
                      <div
                        className={`${stats.played.wonMatches === 0 && 'hidden'} absolute left-0 top-1/2 -translate-y-1/2 z-[1] w-[${stats.played.winRatio}%] ${stats.played.lostMatches === 0 ? 'rounded' : 'rounded-l'} h-full bg-blue`}
                        style={{ width: `${stats.played.winRatio}%` }}
                      >
                        <span className='absolute top-1/2 -translate-y-1/2 text-xs text-white pl-1'>
                          {stats.played.wonMatches}W
                        </span>
                      </div>
                      <span className={`${stats.played.lostMatches === 0 && 'hidden'} text-xs text-white pr-1`}>
                        {stats.played.lostMatches}L
                      </span>
                    </div>
                    <span className={`${stats.played.winRatio >= 60 ? 'text-red-500' : 'text-[#57646F] dark:text-darkMode-lighterGray'} text-xs`}>
                      {stats.played.winRatio}%
                    </span>
                  </TableCell>
                  <TableCell className='table-cell-hover-bg'>
                    <span className={`${numberKda >= 6.0 ? 'text-[#ff8200]' : numberKda >= 4.0 ? 'text-[#0090fb]' : numberKda >= 3.0 ? 'text-[#00bba3]' : 'text-lightMode-secondMediumGray dark:text-darkMode-lighterGray'} block text-center text-xs font-bold`}>
                      {stats.kda.kda}
                    </span>
                    <span className='w-[85px] table-cell text-xss'>{stats.kda.averageKills} / {stats.kda.averageAssists} / {stats.kda.averageDeaths}</span>
                  </TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.totalGold}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.minions.averageKilledMinions} ({stats.minions.minionsPerMinute})</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.maxKills}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.maxDeaths}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.averageDamageDealt}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'doubleKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'tripleKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'quadraKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'pentaKills')}</TableCell>
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