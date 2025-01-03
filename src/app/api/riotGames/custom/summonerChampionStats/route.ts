import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { fetchApi } from '@/app/_utils/fetchApi';
import {
  calculateWinLossStats,
  calculateAverageKdaStats,
  isRecognizedQueueId,
  filterMatchesByMonths
} from '@/app/_utils/matchStats';
import type { NextRequest } from 'next/server';
import type { PickNumberProperties } from '@/app/_types/types';
import type {
  TMatchHistory,
  TChampionStats,
  TKda,
  TSummonerMatchHistoryData
} from '@/app/_types/apiTypes/apiTypes';

interface TMatchSummonerStats extends
  Pick<TSummonerMatchHistoryData,
    'totalDamageDealtToChampions' |
    'totalMinionsKilled' |
    'goldEarned'
  >, Omit<TChampionStats, 'championId'>, Omit<TKda, 'assists'> { };

type NumericSummonerStats = PickNumberProperties<TMatchSummonerStats>;

type TGroupedChampionStatAccumulator = {
  [key: string]: Array<TSummonerMatchHistoryData>;
}

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionContinentLink } = getRouteHandlerParams(req);

  const fetchedMatchHistory = await fetchApi<Array<TMatchHistory>>(
    riotGamesRoutes.summonerMatchHistory(summonerPuuid, regionContinentLink, '100', '0')
  );
  const recentMatches = filterMatchesByMonths(fetchedMatchHistory);
  const matchStats = isRecognizedQueueId(recentMatches);

  const gameDurations = matchStats?.map((stats) => stats?.info.gameDuration);

  const summonerMatchStats = matchStats?.flatMap((stats) =>
    stats?.info.participants.filter((participant) =>
      participant.puuid === summonerPuuid && !participant.gameEndedInEarlySurrender
    )
  );

  const groupedChampionStats = Object.entries(
    (summonerMatchStats || []).reduce((
      accumulator: TGroupedChampionStatAccumulator,
      summoner,
    ) => {
      if (!accumulator[summoner.championId]) {
        accumulator[summoner.championId] = [];
      }
      accumulator[summoner.championId].push(summoner);
      return accumulator;
    }, {})
  );

  const championStatsSummary = groupedChampionStats.map(([championId, championStats], groupIndex) => {
    const championPerformanceData = championStats.reduce((accumulator, champion, championIndex) => {
      const getMaxNumber = (key: 'kills' | 'deaths'): number => {
        return Math.max(accumulator[key], champion[key]);
      }

      const calculateStat = (key: keyof NumericSummonerStats): number => {
        return accumulator[key] + champion[key];
      }

      const calculatedDamgaeDealt = calculateStat('totalDamageDealtToChampions');
      const averageDamageDealt = championStats.length - 1 === championIndex
        ? Math.round(calculatedDamgaeDealt / championStats.length)
        : calculatedDamgaeDealt;

      return {
        goldEarned: calculateStat('goldEarned'),
        doubleKills: calculateStat('doubleKills'),
        tripleKills: calculateStat('tripleKills'),
        quadraKills: calculateStat('quadraKills'),
        pentaKills: calculateStat('pentaKills'),
        kills: getMaxNumber('kills'),
        deaths: getMaxNumber('deaths'),
        totalDamageDealtToChampions: averageDamageDealt,
        totalMinionsKilled: calculateStat('totalMinionsKilled'),
      };
    }, {
      totalDamageDealtToChampions: 0,
      goldEarned: 0,
      doubleKills: 0,
      tripleKills: 0,
      quadraKills: 0,
      pentaKills: 0,
      kills: 0,
      deaths: 0,
      totalMinionsKilled: 0,
    });

    const averageKilledMinions = championPerformanceData.totalMinionsKilled / championStats.length;
    const averageGameDuration = (gameDurations?.[groupIndex] || 0) / championStats.length;
    const minions = {
      averageKilledMinions: averageKilledMinions,
      minionsPerMinute: (averageKilledMinions / (averageGameDuration / 60)).toFixed(2)
    };

    return {
      ...championPerformanceData,
      played: calculateWinLossStats(championStats),
      kda: calculateAverageKdaStats(championStats),
      minions,
      championId
    };
  });

  const championsSortedByGamesPlayed = championStatsSummary.sort((a, b) => {
    const aGames = a.played.wonMatches + a.played.lostMatches;
    const bGames = b.played.wonMatches + b.played.lostMatches;
    return bGames - aGames
  });

  const rankedChampions = championsSortedByGamesPlayed?.map((champion, index) => ({
    ...champion,
    championRank: index + 1
  }));

  return Response.json(rankedChampions);
}