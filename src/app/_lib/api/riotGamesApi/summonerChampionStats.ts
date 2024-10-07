'use server';

import { fetchApi } from '../../utils/utils';
import { getSummonerLastMatchesData } from './riotGamesApi';
import { riotGamesApiKey } from './apiKey';
import type {
  TPromiseResult,
  TSummonerChampionStats,
  TMatchData,
  TMatchParticipantStats
} from '@/app/_types/apiTypes';
import type { TRegionData } from '@/app/_types/types';

type TGroupedChampionStatAccumulator = {
  [key: string]: Array<Omit<TMatchParticipantStats, 'championName' | 'puuid'>>;
}

type TGroupedChampionStats = Array<[string, Array<Omit<TMatchParticipantStats, "championName" | "puuid">>]>

const getMaxNumber = (groupedChampionStats: TGroupedChampionStats, key: 'kills' | 'deaths'): Array<number> => {
  return groupedChampionStats.map(([_, championStats]) => (
    championStats.reduce((accumulator, object) => Math.max(accumulator, object[key]), 0)
  ))
}

const calculateTotalChampionStat = (groupedChampionStats: TGroupedChampionStats, key: keyof Omit<TMatchParticipantStats, 'championName' | 'puuid' | 'win'>): Array<number> => {
  return groupedChampionStats.map(([_, championStats]) => (
    championStats.reduce((acumulator, object) => acumulator + object[key], 0)
  ))
}

export const getSummonerChampionStats = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<Array<TSummonerChampionStats>>> => {
  const matchStats = await getSummonerLastMatchesData(regionData, summonerPuuid);

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

  const championPlayedStats = groupedChampionStats.map(([_, championStats]) => {
    let wonMatches = 0;
    let lostMatches = 0;

    championStats.forEach((data) => {
      if (data.win) {
        wonMatches++;
      }
      else {
        lostMatches++;
      }
    });

    const winRatio = Math.round((wonMatches / championStats.length) * 100);

    return {
      winRatio,
      wonMatches,
      lostMatches
    }
  });

  const championKdaStats = groupedChampionStats.map(([_, championStats]) => {
    const { assists: totalAssists, deaths: totalDeaths, kills: totalKills } = championStats.reduce(
      (accumulator, { assists, deaths, kills }) => {
        return {
          assists: accumulator.assists + assists,
          deaths: accumulator.deaths + deaths,
          kills: accumulator.kills + kills,
        }
      }, { assists: 0, deaths: 0, kills: 0 }
    );

    const kda = totalDeaths === 0 ? totalAssists + totalKills : (totalAssists + totalKills) / totalDeaths;

    return {
      kda: kda,
      averageKills: (totalKills / championStats.length).toFixed(1),
      averageAssists: (totalAssists / championStats.length).toFixed(1),
      averageDeaths: (totalDeaths / championStats.length).toFixed(1)
    }
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