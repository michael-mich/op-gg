'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerChampionStats } from '@/app/_lib/api/riotGamesApi/summonerChampionStats';
import { getFilteredChampions } from '@/app/_lib/api/riotGamesApi/riotGamesApi';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import type { TSummonerChampionStats, TChampionStats } from '@/app/_types/apiTypes';
import type { TSummonerPageParams } from '@/app/_types/types';
import type { TDetailedChampionStats, TNumericStatKeyPath } from './types';
import { TableColumns, SortOrder } from './enums';
import { columns } from './data';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, CircularProgress } from '@nextui-org/react';

const Page = () => {
  const [detailedChampionStats, setDetailedChampionStats] = useState<Array<TDetailedChampionStats> | undefined>([]);
  const [sortOptionIndex, setSortOptionIndex] = useState<TableColumns>(TableColumns.TotalGames);
  const [sortOrderDescending, setSortOrderDescending] = useState(true);

  const params = useParams<TSummonerPageParams>();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = useMemo(() => getRegionDataFromParams(params.region), [params.region]);

  const {
    data: championStats,
    refetch: refetchChapionStats,
    isError: isChampionStatsError,
    isSuccess: isChampionStatsSuccess,
    isRefetching: isChampionStatsRefetching
  } = useQuery({
    enabled: false,
    queryKey: ['matchStats', 'summonerPage', summonerPuuid],
    queryFn: () => getSummonerChampionStats(currentRegionData, summonerPuuid)
  });

  const {
    data: championsData,
    refetch: refetchChampionsData,
    isSuccess: isChampionsDataSuccess,
    isError: isChampionDataError,
    isFetched: isChampionDataFetched,
    isRefetching: isChampionDataRefetching
  } = useQuery({
    enabled: false,
    queryKey: ['championData', 'summonerChampionsPage', summonerPuuid],
    queryFn: () => getFilteredChampions(championStats)
  });

  const loadingCondition = (!summonerPuuid || !isChampionDataFetched || isChampionStatsRefetching || isChampionDataRefetching);

  const formatKillStat = (stat: TSummonerChampionStats, key: keyof Omit<TChampionStats, 'championId'>): number | string => {
    return stat[key] === 0 ? '' : stat[key];
  }

  const sortChampionsByNumericPath = (order: SortOrder, keyPath: TNumericStatKeyPath): Array<TDetailedChampionStats> | undefined => {
    const getNestedValue = (obj: TDetailedChampionStats): number => {
      return keyPath.split('.').reduce((acc, key) => (acc as any)[key], obj) as unknown as number;
    }

    if (order === SortOrder.Descending) {
      return detailedChampionStats && [...detailedChampionStats].sort((a, b) => getNestedValue(b) - getNestedValue(a));
    }
    else {
      return detailedChampionStats && [...detailedChampionStats].sort((a, b) => getNestedValue(a) - getNestedValue(b));
    }
  }

  const sortByTotalGames = (order: SortOrder, stats: Array<TDetailedChampionStats> | undefined): Array<TDetailedChampionStats> | undefined => {
    return stats && [...stats].sort((a, b) => {
      const aGames = a.played.wonMatches + a.played.lostMatches;
      const bGames = b.played.wonMatches + b.played.lostMatches;

      if (aGames !== bGames) {
        return order === SortOrder.Descending ? bGames - aGames : aGames - bGames;
      }
      else if (a.championRank && b.championRank) {
        return order === SortOrder.Descending ? a.championRank - b.championRank : b.championRank - a.championRank;
      }

      return 0;
    });
  }

  const handleSortOrder = (tableColumns: TableColumns, descendingData: Array<TDetailedChampionStats> | undefined, ascendingData: Array<TDetailedChampionStats> | undefined): void => {
    if (sortOrderDescending && sortOptionIndex === tableColumns) {
      setSortOrderDescending(false);
      setDetailedChampionStats(ascendingData);
    }
    else if (!sortOrderDescending && sortOptionIndex !== tableColumns) {
      setDetailedChampionStats(ascendingData);
    }
    else {
      !sortOrderDescending && setSortOrderDescending(true);
      setDetailedChampionStats(descendingData);
    }
  }

  const handleChampionsSortByNumericPath = (column: TableColumns, keyPath: TNumericStatKeyPath): void => {
    const descending = sortChampionsByNumericPath(SortOrder.Descending, keyPath);
    const ascending = sortChampionsByNumericPath(SortOrder.Ascending, keyPath);

    handleSortOrder(column, descending, ascending);
  }

  const updateChampionStats = (): void => {
    const updatedStats: Array<TDetailedChampionStats> | undefined = championStats?.map((stats) => {
      const matchingChampion = championsData?.find((data) => (
        data.key === stats.championId.toString()
      ));

      return {
        ...stats,
        championName: matchingChampion?.name,
        championImage: matchingChampion?.image.full
      }
    });

    const sortedDescendingArray = sortByTotalGames(SortOrder.Descending, updatedStats);
    const rankedChampionStats: Array<TDetailedChampionStats> | undefined = sortedDescendingArray?.map((stats, index) => ({
      ...stats,
      championRank: index + 1
    }));

    setDetailedChampionStats(rankedChampionStats);
  }

  const sortChampionsByMostPlayedGmaes = (): void => {
    const descending = sortByTotalGames(SortOrder.Descending, detailedChampionStats);
    const ascending = sortByTotalGames(SortOrder.Ascending, detailedChampionStats);

    handleSortOrder(TableColumns.TotalGames, descending, ascending);
  }

  const sortChampionsAlphabetically = (): void => {
    const sortedDescendingByChampionName = detailedChampionStats && [...detailedChampionStats].sort((a, b) => b.championName!.localeCompare(a.championName!));
    const sortedAscendingByChampionName = detailedChampionStats && [...detailedChampionStats].sort((a, b) => a.championName!.localeCompare(b.championName!));

    handleSortOrder(TableColumns.Champion, sortedDescendingByChampionName, sortedAscendingByChampionName);
  }

  const sortChampionByWinRatio = (): void => {
    const descending = detailedChampionStats && [...detailedChampionStats].sort((a, b) => {
      if (b.played.winRatio !== a.played.winRatio) {
        return b.played.winRatio - a.played.winRatio;
      }
      else {
        return b.championRank! - a.championRank!;
      }
    });

    const ascending = detailedChampionStats && [...detailedChampionStats].sort((a, b) => {
      if (a.played.winRatio !== b.played.winRatio) {
        return a.played.winRatio - b.played.winRatio;
      }
      else {
        return a.championRank! - b.championRank!;
      }
    });

    handleSortOrder(TableColumns.Played, descending, ascending);
  }

  const handleSortActions = (index: number): void => {
    switch (index) {
      case TableColumns.TotalGames:
        sortChampionsByMostPlayedGmaes();
        break;
      case TableColumns.Champion:
        sortChampionsAlphabetically();
        break;
      case TableColumns.Played:
        sortChampionByWinRatio();
        break;
      case TableColumns.Kda:
        handleChampionsSortByNumericPath(TableColumns.Kda, 'kda.kda');
        break;
      case TableColumns.Gold:
        handleChampionsSortByNumericPath(TableColumns.Gold, 'totalGold');
        break;
      case TableColumns.Cs:
        handleChampionsSortByNumericPath(TableColumns.Cs, 'minions.averageKilledMinions');
        break;
      case TableColumns.MaxKills:
        handleChampionsSortByNumericPath(TableColumns.MaxKills, 'maxKills');
        break;
      case TableColumns.MaxDeaths:
        handleChampionsSortByNumericPath(TableColumns.MaxDeaths, 'maxDeaths');
        break;
      case TableColumns.AverageDamageDealt:
        handleChampionsSortByNumericPath(TableColumns.AverageDamageDealt, 'averageDamageDealt');
        break;
      case TableColumns.DoubleKill:
        handleChampionsSortByNumericPath(TableColumns.DoubleKill, 'doubleKills');
        break;
      case TableColumns.TripleKill:
        handleChampionsSortByNumericPath(TableColumns.TripleKill, 'tripleKills');
        break;
      case TableColumns.QuadraKill:
        handleChampionsSortByNumericPath(TableColumns.QuadraKill, 'quadraKills');
        break;
      case TableColumns.PentaKill:
        handleChampionsSortByNumericPath(TableColumns.PentaKill, 'pentaKills');
        break;
      default:
        console.log('error');
    }
  }

  useEffect(() => {
    if (summonerPuuid) {
      refetchChapionStats();
    }
  }, [summonerPuuid]);

  useEffect(() => {
    if (isChampionStatsSuccess) {
      refetchChampionsData();
    }
  }, [isChampionStatsSuccess]);

  useEffect(() => {
    if (isChampionStatsSuccess && isChampionsDataSuccess) {
      updateChampionStats();
    }
  }, [isChampionStatsSuccess, isChampionsDataSuccess]);

  if (isChampionStatsError || isChampionDataError) {
    return <p>error</p>
  }

  return (
    <div className={`custom-table-wrapper ${loadingCondition && 'loading'}`}>
      {loadingCondition
        ?
        <CircularProgress aria-label='champion stats loading' />
        :
        <Table aria-label='table with champion stats'>
          <TableHeader>
            {columns.map((column, index) =>
              <TableColumn
                onClick={() => { handleSortActions(index), setSortOptionIndex(index) }}
                className={`${(index >= 2) && 'text-center'} ${(!isChampionStatsSuccess && !isChampionStatsSuccess) ? 'pointer-events-none' : 'pointer-events-auto'} cursor-pointer
                  relative after:absolute after:left-0 after:-z[1] after:w-full after:bg-blue ${(sortOptionIndex === index && sortOrderDescending) ? 'after:bottom-0 after:h-[2px]' : (sortOptionIndex === index && !sortOrderDescending) ? 'after:top-0 after:h-[2px]' : ''}`}
                key={column}
              >
                <div className={`${index >= 8 && 'w-10 overflow-hidden text-ellipsis'} ${sortOptionIndex === index ? 'text-blue' : 'text-secondGray dark:text-mediumGrayText'}`}>
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
              detailedChampionStats?.map((stats) => (
                <TableRow
                  className='group even:bg-lightMode-lightGray dark:even:bg-darkMode-darkGray'
                  key={stats.championId}
                >
                  <TableCell className='table-cell-hover-bg'>{stats.championRank}</TableCell>
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
                    <span className={`${stats.kda.kda >= 6.0 ? 'text-[#ff8200]' : stats.kda.kda >= 4.0 ? 'text-[#0090fb]' : stats.kda.kda >= 3.0 ? 'text-[#00bba3]' : 'text-lightMode-secondMediumGray dark:text-darkMode-lighterGray'} block text-center text-xs font-bold`}>
                      {stats.kda.kda.toFixed(2)}
                    </span>
                    <span className='w-[85px] table-cell text-xss'>{stats.kda.averageKills} / {stats.kda.averageAssists} / {stats.kda.averageDeaths}</span>
                  </TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.totalGold.toLocaleString()}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.minions.averageKilledMinions.toFixed(1)} ({stats.minions.minionsPerMinute})</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.maxKills}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.maxDeaths}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{stats.averageDamageDealt.toLocaleString()}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'doubleKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'tripleKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'quadraKills')}</TableCell>
                  <TableCell className='table-cell table-cell-hover-bg'>{formatKillStat(stats, 'pentaKills')}</TableCell>
                </TableRow>
              ))
              :
              []
            }
          </TableBody>
        </Table>
      }
    </div>
  );
}

export default Page;