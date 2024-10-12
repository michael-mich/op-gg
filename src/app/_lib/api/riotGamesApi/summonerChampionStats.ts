'use server';

import { getSummonerMatchHistoryData } from './riotGamesApi';
import { calculateWinLossStats, calculateKdaStats } from '../../utils/matchStats';
import type { TPromiseResult } from '@/app/_types/apiTypes/apiTypes';
import {
  TMatchParticipantStats,
  TSummonerChampionStats
} from '@/app/_types/apiTypes/championStatsTypes';
import type { TChampionWinLostRatio, TRegionData } from '@/app/_types/types';

type OmitMatchParticipantStats = 'championName' | 'puuid' | 'teamId';

type TGroupedChampionStatAccumulator = {
  [key: string]: Array<Omit<TMatchParticipantStats, OmitMatchParticipantStats>>;
}

type TGroupedChampionStats = Array<[string, Array<Omit<TMatchParticipantStats, OmitMatchParticipantStats>>]>

const getMaxNumber = (groupedChampionStats: TGroupedChampionStats, key: 'kills' | 'deaths'): Array<number> => {
  return groupedChampionStats.map(([_, championStats]) => (
    championStats.reduce((accumulator, object) => Math.max(accumulator, object[key]), 0)
  ))
}

const calculateTotalChampionStat = (groupedChampionStats: TGroupedChampionStats, key: keyof Omit<TMatchParticipantStats, OmitMatchParticipantStats | 'win'>): Array<number> => {
  return groupedChampionStats.map(([_, championStats]) => (
    championStats.reduce((acumulator, object) => acumulator + object[key], 0)
  ))
}

export const getSummonerChampionStats = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<Array<TSummonerChampionStats>>> => {
  const matchStats = await getSummonerMatchHistoryData(regionData, summonerPuuid);

  const summonerMatchStats = matchStats?.flatMap((stats) => stats?.info.participants.filter((participant) => participant.puuid === summonerPuuid));
  const gameDurations = matchStats?.map((stats) => stats?.info.gameDuration);

  const groupedChampionStats: TGroupedChampionStats = Object.entries(
    (summonerMatchStats as Array<TMatchParticipantStats>).reduce((accumulator: TGroupedChampionStatAccumulator, {
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
    return calculateKdaStats(championStats);
  });

  const championStats: Array<TSummonerChampionStats> = groupedChampionStats.map((_, index) => {
    return {
      kda: championKdaStats[index],
      played: championPlayedStats[index],
      minions: minionStatsPerChampion[index],
      totalGold: totalGoldPerChampion[index],
      maxKills: maxKillsPerChampion[index],
      maxDeaths: maxDeathsPerChampion[index],
      averageDamageDealt: averageDamageDealtToChampions[index],
      doubleKills: totalDoubleKillsPerChampion[index],
      tripleKills: totalTripleKillsPerChampion[index],
      quadraKills: totalQuadraKillsPerChampion[index],
      pentaKills: totalPentaKillsPerChampion[index],
      championId: championsId[index]
    }
  });

  return championStats;
}