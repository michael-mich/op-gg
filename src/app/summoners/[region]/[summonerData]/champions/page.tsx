'use client';

import { useEffect, useState } from 'react';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import { findChampionById, handleKdaTextColor } from '../_utils/utils';
import type { PickNumberProperties } from '@/app/_types/types';
import type { TChampionStats } from '@/app/_types/apiTypes/apiTypes';
import type { TSummonerChampionStats } from '@/app/_types/apiTypes/customApiTypes';
import { TableColumnIndex, SortOrder } from './enums';
import { columns } from './data';
import ChampionAvatar from '@/app/_components/ChampionAvatar';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress
} from '@nextui-org/react';

type TNumericChampionStats = PickNumberProperties<TSummonerChampionStats>;
type TNumericStatKeyPath = keyof TNumericChampionStats | 'kda.kda' | 'minions.averageKilledMinions';

const Page = () => {
  const [sortedChampionStats, setSortedChampionStats] = useState<Array<TSummonerChampionStats> | undefined>([]);
  const [sortOptionIndex, setSortOptionIndex] = useState<TableColumnIndex>(TableColumnIndex.TotalGames);
  const [isSortOrderDescending, setIsSortOrderDescending] = useState(true);
  const { continentLink } = useCurrentRegion() || {};
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);

  const { data: championData } = useChampionDataQuery();

  const {
    data: championStats,
    isError: isChampionStatsError,
    isSuccess: isChampionStatsSuccess,
    isPending: isChampionStatsPending,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['matchStats', 'summonerPage', summonerPuuid],
    queryFn: () => {
      return fetchApi<Array<TSummonerChampionStats>>(
        riotGamesCustomRoutes.summonerChampionStats(summonerPuuid, continentLink)
      );
    }
  });

  const handleSortOrder = (
    tableColumnIndex: TableColumnIndex,
    descendingData: Array<TSummonerChampionStats> | undefined,
    ascendingData: Array<TSummonerChampionStats> | undefined
  ): void => {
    if (isSortOrderDescending && sortOptionIndex === tableColumnIndex) {
      setIsSortOrderDescending(false);
      setSortedChampionStats(ascendingData);
    } else if (!isSortOrderDescending && sortOptionIndex !== tableColumnIndex) {
      setSortedChampionStats(ascendingData);
    } else {
      !isSortOrderDescending && setIsSortOrderDescending(true);
      setSortedChampionStats(descendingData);
    }
  }

  const handleChampionsSortByNumericPath = (
    tableColumnIndex: TableColumnIndex,
    keyPath: TNumericStatKeyPath
  ): void => {
    const sortChampionsByNumericPath = (
      order: SortOrder,
      keyPath: TNumericStatKeyPath
    ): Array<TSummonerChampionStats> | undefined => {
      const getNestedValue = (obj: TSummonerChampionStats): number => {
        return keyPath.split('.').reduce((acc, key) => (acc as any)[key], obj) as unknown as number;
      }

      return sortedChampionStats && [...sortedChampionStats].sort((a, b) => {
        const aValue = getNestedValue(a);
        const bValue = getNestedValue(b);
        return order === SortOrder.Descending ? bValue - aValue : aValue - bValue;
      })
    }

    const descending = sortChampionsByNumericPath(SortOrder.Descending, keyPath);
    const ascending = sortChampionsByNumericPath(SortOrder.Ascending, keyPath);
    handleSortOrder(tableColumnIndex, descending, ascending);
  }

  const sortChampionsByMostPlayedGmaes = (): void => {
    const sortByTotalGames = (order: SortOrder): Array<TSummonerChampionStats> | undefined => {
      return sortedChampionStats && [...sortedChampionStats].sort((a, b) => {
        const aGames = a.played.wonMatches + a.played.lostMatches;
        const bGames = b.played.wonMatches + b.played.lostMatches;

        if (aGames !== bGames) {
          return order === SortOrder.Descending ? bGames - aGames : aGames - bGames;
        } else if (a.championRank && b.championRank) {
          return order === SortOrder.Descending
            ? a.championRank - b.championRank
            : b.championRank - a.championRank;
        }

        return 0;
      });
    }

    const descending = sortByTotalGames(SortOrder.Descending);
    const ascending = sortByTotalGames(SortOrder.Ascending);
    handleSortOrder(TableColumnIndex.TotalGames, descending, ascending);
  }

  const sortChampionsAlphabetically = (): void => {
    const sortChampionByName = (order: SortOrder) => {
      return sortedChampionStats && [...sortedChampionStats].sort((a, b) => {
        const aChamp = findChampionById(championData, a.championId);
        const aChampionName = aChamp?.name || '';

        const bChamp = findChampionById(championData, b.championId);
        const bChampionName = bChamp?.name || '';

        if (order === SortOrder.Descending) {
          return bChampionName.localeCompare(aChampionName);
        } else {
          return aChampionName.localeCompare(bChampionName);
        }
      });
    }
    handleSortOrder(
      TableColumnIndex.Champion,
      sortChampionByName(SortOrder.Descending),
      sortChampionByName(SortOrder.Ascending)
    );
  }

  const sortChampionByWinRatio = (): void => {
    const sortByOrder = (order: SortOrder) => {
      return sortedChampionStats && [...sortedChampionStats].sort((a, b) => {
        const primary = order === SortOrder.Descending ? b : a;
        const secondary = order === SortOrder.Descending ? a : b;

        if (primary.played.winRatio !== secondary.played.winRatio) {
          return primary.played.winRatio - secondary.played.winRatio;
        } else {
          return primary.championRank - secondary.championRank;
        }
      });
    }
    handleSortOrder(
      TableColumnIndex.Played,
      sortByOrder(SortOrder.Descending),
      sortByOrder(SortOrder.Ascending)
    );
  }

  const handleSortActions = (index: number): void => {
    switch (index) {
      case TableColumnIndex.TotalGames:
        sortChampionsByMostPlayedGmaes();
        break;
      case TableColumnIndex.Champion:
        sortChampionsAlphabetically();
        break;
      case TableColumnIndex.Played:
        sortChampionByWinRatio();
        break;
      case TableColumnIndex.Kda:
        handleChampionsSortByNumericPath(TableColumnIndex.Kda, 'kda.kda');
        break;
      case TableColumnIndex.Gold:
        handleChampionsSortByNumericPath(TableColumnIndex.Gold, 'goldEarned');
        break;
      case TableColumnIndex.Cs:
        handleChampionsSortByNumericPath(TableColumnIndex.Cs, 'minions.averageKilledMinions');
        break;
      case TableColumnIndex.MaxKills:
        handleChampionsSortByNumericPath(TableColumnIndex.MaxKills, 'kills');
        break;
      case TableColumnIndex.MaxDeaths:
        handleChampionsSortByNumericPath(TableColumnIndex.MaxDeaths, 'deaths');
        break;
      case TableColumnIndex.AverageDamageDealt:
        handleChampionsSortByNumericPath(TableColumnIndex.AverageDamageDealt, 'totalDamageDealtToChampions');
        break;
      case TableColumnIndex.DoubleKill:
        handleChampionsSortByNumericPath(TableColumnIndex.DoubleKill, 'doubleKills');
        break;
      case TableColumnIndex.TripleKill:
        handleChampionsSortByNumericPath(TableColumnIndex.TripleKill, 'tripleKills');
        break;
      case TableColumnIndex.QuadraKill:
        handleChampionsSortByNumericPath(TableColumnIndex.QuadraKill, 'quadraKills');
        break;
      case TableColumnIndex.PentaKill:
        handleChampionsSortByNumericPath(TableColumnIndex.PentaKill, 'pentaKills');
        break;
      default:
        console.error('Wrong index');
    }
  }

  useEffect(() => {
    if (isChampionStatsSuccess && championStats) {
      setSortedChampionStats([...championStats]);
    }
  }, [isChampionStatsSuccess]);

  if (isChampionStatsError) {
    return <p>error</p>
  }

  return (
    <div className={`custom-table-wrapper ${isChampionStatsPending && 'loading'}`}>
      {isChampionStatsPending ? (
        <CircularProgress aria-label='champion stats loading' />
      ) : (
        <Table aria-label='table with champion stats'>
          <TableHeader>
            {columns.map((column, index) =>
              <TableColumn
                onClick={() => { handleSortActions(index); setSortOptionIndex(index); }}
                className={`${(index >= 2) && 'text-center'} ${(!isChampionStatsSuccess && !isChampionStatsSuccess) ? 'pointer-events-none' : 'pointer-events-auto'} cursor-pointer
                relative after:absolute after:left-0 after:-z[1] after:w-full after:bg-blue 
                ${(sortOptionIndex === index && isSortOrderDescending) ? 'after:bottom-0 after:h-[2px]' : (sortOptionIndex === index && !isSortOrderDescending) ? 'after:top-0 after:h-[2px]' : ''}`}
                key={column}
              >
                <div className={`${index >= 8 && 'w-10 overflow-hidden text-ellipsis'} 
                ${sortOptionIndex === index ? 'text-blue' : 'text-secondGray dark:text-mediumGrayText'}`}
                >
                  {column}
                </div>
                <div className='stats-info hidden absolute -top-full left-1/2 -translate-x-1/2 z-[2] bg-black py-2 px-2.5'>
                  <span className='text-xs text-white font-normal'>{column}</span>
                  <div className='absolute top-6 left-1/2 -translate-x-1/2 rotate-45 z-[1] size-4 bg-black'></div>
                </div>
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={'No champion stats to display'}>
            {(sortedChampionStats && championStats) ? (
              (sortedChampionStats.length > 0 ? sortedChampionStats : championStats)?.map((stats) => {
                const foundChampion = findChampionById(championData, stats.championId);

                return (
                  <TableRow
                    className='group even:bg-lightMode-lightGray dark:even:bg-darkMode-darkGray'
                    key={stats.championId}
                  >
                    <TableCell className='table-cell-hover-bg'>{stats.championRank}</TableCell>
                    <TableCell className='table-cell-hover-bg'>
                      <div className='flex items-center gap-2'>
                        <ChampionAvatar
                          championData={foundChampion}
                          imageSize='medium'
                          isRoundedImage
                        />
                        <span className='text-xs font-bold'>{foundChampion?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='flex items-center gap-2 h-[61.5px] table-cell-hover-bg '>
                      <div className='relative flex items-center justify-end w-[90px] h-5 bg-red rounded'>
                        <div
                          className={`${stats.played.wonMatches === 0 && 'hidden'} absolute left-0 top-1/2 -translate-y-1/2 z-[1]
                          ${stats.played.lostMatches === 0 ? 'rounded' : 'rounded-l'} h-full bg-blue`}
                          style={{ width: `${stats.played.winRatio}%`, maxWidth: `${stats.played.lostMatches > 0 ? '80%' : 'auto'}` }}
                        >
                          <span className='absolute top-1/2 -translate-y-1/2 text-xs text-white pl-1'>
                            {stats.played.wonMatches}W
                          </span>
                        </div>
                        <span className={`${stats.played.lostMatches === 0 && 'hidden'} text-xs text-white pr-1`}>
                          {stats.played.lostMatches}L
                        </span>
                      </div>
                      <span className={`${stats.played.winRatio >= 60 ? 'text-red' : 'text-[#57646F] dark:text-darkMode-lighterGray'} text-xs`}>
                        {stats.played.winRatio}%
                      </span>
                    </TableCell>
                    <TableCell className='table-cell-hover-bg'>
                      <span className={`${handleKdaTextColor(stats.kda.kda)} block text-center text-xs font-bold`}>
                        {(stats.kda.averageKills !== '0.0' && stats.kda.averageDeaths === '0.0' && stats.kda.averageAssists !== '0.0') ? 'Perfect' : `${stats.kda.kda.toFixed(2)}:1`}
                      </span>
                      <span className='w-[85px] table-cell text-xss'>{stats.kda.averageKills} / {stats.kda.averageDeaths} / {stats.kda.averageAssists}</span>
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {stats.goldEarned.toLocaleString('en')}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {stats.minions.averageKilledMinions.toFixed(1)} ({stats.minions.minionsPerMinute})
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {stats.kills}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {stats.deaths}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {stats.totalDamageDealtToChampions.toLocaleString('en')}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {formatKillStat(stats, 'doubleKills')}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {formatKillStat(stats, 'tripleKills')}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {formatKillStat(stats, 'quadraKills')}
                    </TableCell>
                    <TableCell className='table-cell table-cell-hover-bg'>
                      {formatKillStat(stats, 'pentaKills')}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              []
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Page;

const formatKillStat = (
  stat: TSummonerChampionStats,
  key: keyof Omit<TChampionStats, 'championId'>
): number | string => {
  return stat[key] === 0 ? '' : stat[key];
}