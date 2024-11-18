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
import type { TMatchHistory } from '@/app/_types/apiTypes/apiTypes';
import type {
  TMatchParticipantStats,
  TChampionWinLostRatio,
  TSummonerChampionStats
} from '@/app/_types/apiTypes/customApiTypes';

type OmitMatchParticipantStats = 'championName' | 'puuid' | 'teamId';

type TGroupedChampionStatAccumulator = {
  [key: string]: Array<Omit<TMatchParticipantStats, OmitMatchParticipantStats>>;
}

type TGroupedChampionStats = Array<[string, Array<Omit<TMatchParticipantStats, OmitMatchParticipantStats>>]>

const getMaxNumber = (
  groupedChampionStats: TGroupedChampionStats,
  key: 'kills' | 'deaths'
): Array<number> => {
  return groupedChampionStats.map(([_, championStats]) => (
    championStats.reduce((accumulator, object) => Math.max(accumulator, object[key]), 0)
  ));
}

const calculateTotalChampionStat = (
  groupedChampionStats: TGroupedChampionStats,
  key: keyof Omit<TMatchParticipantStats, OmitMatchParticipantStats | 'win'>
): Array<number> => {
  return groupedChampionStats.map(([_, championStats]) => (
    championStats.reduce((acumulator, object) => acumulator + object[key], 0)
  ));
}

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionContinentLink } = getRouteHandlerParams(req);

  const fetchedMatchHistory = await fetchApi<Array<TMatchHistory>>(
    riotGamesRoutes.summonerMatchHistory(summonerPuuid, regionContinentLink, '100', '0')
  );
  const recentMatches = filterMatchesByMonths(fetchedMatchHistory);
  const matchStats = isRecognizedQueueId(recentMatches);

  const summonerMatchStats = matchStats?.flatMap((stats) =>
    stats?.info.participants.filter((participant) => participant.puuid === summonerPuuid)
  );
  const gameDurations = matchStats?.map((stats) => stats?.info.gameDuration);

  const groupedChampionStats: TGroupedChampionStats = Object.entries(
    (summonerMatchStats as unknown as Array<TMatchParticipantStats>).reduce((accumulator: TGroupedChampionStatAccumulator, {
      championName,
      assists,
      deaths,
      kills,
      win,
      totalMinionsKilled,
      goldEarned,
      totalDamageDealtToChampions,
      doubleKills,
      tripleKills,
      quadraKills,
      pentaKills,
      championId
    }, index) => {
      if (!accumulator[championName]) {
        accumulator[championName] = [];
      }

      accumulator[championName].push({
        assists,
        deaths,
        kills,
        win,
        totalMinionsKilled,
        goldEarned,
        gameDuration: gameDurations?.[index] ?? 0,
        totalDamageDealtToChampions,
        doubleKills,
        tripleKills,
        quadraKills,
        pentaKills,
        championId
      });

      return accumulator;
    }, {})
  ).filter(([championName, _]) => !championName.includes('Strawberry'));

  const championsId = groupedChampionStats.map(([_, championStats]) => championStats[0].championId);

  const maxKillsPerChampion = getMaxNumber(groupedChampionStats, 'kills');
  const maxDeathsPerChampion = getMaxNumber(groupedChampionStats, 'deaths');

  const totalGoldPerChampion = calculateTotalChampionStat(groupedChampionStats, 'goldEarned');
  const totalChampionDamageDealt = calculateTotalChampionStat(groupedChampionStats, 'totalDamageDealtToChampions');
  const totalMinionsKilledSum = calculateTotalChampionStat(groupedChampionStats, 'totalMinionsKilled');
  const totalGameDurationSum = calculateTotalChampionStat(groupedChampionStats, 'gameDuration');
  const totalDoubleKillsPerChampion = calculateTotalChampionStat(groupedChampionStats, 'doubleKills');
  const totalTripleKillsPerChampion = calculateTotalChampionStat(groupedChampionStats, 'tripleKills');
  const totalQuadraKillsPerChampion = calculateTotalChampionStat(groupedChampionStats, 'quadraKills');
  const totalPentaKillsPerChampion = calculateTotalChampionStat(groupedChampionStats, 'pentaKills');

  const averageDamageDealtToChampions = groupedChampionStats.map(([_, championStats], index) => {
    return Math.round((totalChampionDamageDealt[index] / championStats.length));
  });

  const minionStatsPerChampion = groupedChampionStats.map(([_, championStats], index) => {
    const averageKilledMinions = totalMinionsKilledSum[index] / championStats.length;
    const averageGameDuration = totalGameDurationSum[index] / championStats.length;

    return {
      averageKilledMinions: averageKilledMinions,
      minionsPerMinute: (averageKilledMinions / (averageGameDuration / 60)).toFixed(2)
    }
  });

  const championPlayedStats = groupedChampionStats.map(([_, championStats]): TChampionWinLostRatio => {
    return calculateWinLossStats(championStats);
  });

  const championKdaStats = groupedChampionStats.map(([_, championStats]) => {
    return calculateAverageKdaStats(championStats);
  });

  const championStats: Array<TSummonerChampionStats> = groupedChampionStats.map((_, index) => {
    return {
      kda: championKdaStats[index],
      played: championPlayedStats[index],
      minions: minionStatsPerChampion[index],
      totalGold: totalGoldPerChampion[index],
      maxKills: maxKillsPerChampion?.[index],
      maxDeaths: maxDeathsPerChampion?.[index],
      averageDamageDealt: averageDamageDealtToChampions[index],
      doubleKills: totalDoubleKillsPerChampion[index],
      tripleKills: totalTripleKillsPerChampion[index],
      quadraKills: totalQuadraKillsPerChampion[index],
      pentaKills: totalPentaKillsPerChampion[index],
      championId: championsId[index]
    }
  });

  return Response.json(championStats);
}