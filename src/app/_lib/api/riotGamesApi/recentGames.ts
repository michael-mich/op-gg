'use server';

import { getSummonerMatchHistoryData } from './riotGamesApi';
import {
  calculateWinLossStats,
  calculateKdaStats,
  segregateSummonersToTeams,
  calculatePercentage
} from '../../utils/matchStats';
import type { TRecetGames, TPromiseResult } from '@/app/_types/apiTypes/apiTypes';
import type { TRegionData, TKda, TChampionWinLostRatio } from '@/app/_types/types';

interface TChampionPerformance extends TKda, Omit<TChampionWinLostRatio, 'winRatio'> {
  playAmount: number;
}

type TChampionPerformanceKey = {
  [key: string]: TChampionPerformance;
}

type TPositionPlayAmount = {
  [key: string]: Pick<TChampionPerformance, 'playAmount'>;
}

export const getRecentGamesData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<TRecetGames>> => {
  const matchHistoryData = await getSummonerMatchHistoryData(regionData, summonerPuuid);
  const totalGames = (matchHistoryData && matchHistoryData.length) as number | undefined;

  const currentSummonerMatchData = matchHistoryData?.flatMap((match) =>
    match.info.participants.filter((participant) => (participant.puuid === summonerPuuid))
  );

  const summonerPositionPlayAmount = currentSummonerMatchData?.reduce((championStats, match) => {
    const { individualPosition } = match;
    const position = individualPosition.toLowerCase();
    let positionData = championStats[position];

    if (!positionData) {
      positionData = championStats[position] = {
        playAmount: 0
      };
    }
    positionData.playAmount += 1;

    return championStats;
  }, {} as TPositionPlayAmount);

  const summonerPositionPlayPercentage = Object.entries(summonerPositionPlayAmount || {}).map(([position, data]) => ({
    position,
    playedPercentage: calculatePercentage(data.playAmount, totalGames || 0)
  }));

  const summonerChampionPerformance = currentSummonerMatchData?.reduce((championStats, match) => {
    const { kills, deaths, assists, championName } = match;
    let championData = championStats[championName];

    if (!championData) {
      championData = championStats[championName] = {
        kills: 0,
        deaths: 0,
        assists: 0,
        playAmount: 0,
        wonMatches: 0,
        lostMatches: 0
      }
    }
    championData.playAmount += 1;
    championData.assists += assists;
    championData.deaths += deaths;
    championData.kills += kills;
    if (match.win) {
      championData.wonMatches += 1;
    }
    else {
      championData.lostMatches += 1;
    }

    return championStats;
  }, {} as TChampionPerformanceKey);

  const topPlayedChampions = () => {
    const entries = Object.entries(summonerChampionPerformance || {});
    const descendingOrder = entries.sort((a, b) => b[1].playAmount - a[1].playAmount);
    return descendingOrder.slice(0, 3);
  }

  const udpatedTopPlayedChampionsData = topPlayedChampions()?.map(([championName, championData]) => ({
    ...championData,
    championName,
    winRatio: calculatePercentage(championData.wonMatches, championData.playAmount),
    kda: calculateKdaStats([championData]).kda
  }));

  const summonersIntoTeams = matchHistoryData?.map((match) => segregateSummonersToTeams(match.info.participants));

  const teamKillsPerMatch = summonersIntoTeams?.map((team) => {
    const teamsWithCurrentSummoner = team.find((teamData) => teamData.teamParticipants.some((participant) => {
      return participant.puuid === summonerPuuid;
    }));

    return teamsWithCurrentSummoner?.teamParticipants.reduce((acc, { kills }) => {
      return acc + kills
    }, 0);
  });

  const killParticipationForEachMatch = currentSummonerMatchData?.map((summonerData, index) => {
    const assistsAndKillsSum = summonerData.kills + summonerData.assists;
    if (typeof teamKillsPerMatch?.[index] === 'number') {
      return (assistsAndKillsSum / teamKillsPerMatch[index]) * 100;
    }
  }).filter(Boolean);

  const averageKillParticipation = () => {
    if (killParticipationForEachMatch && totalGames) {
      const killParticipationSum = killParticipationForEachMatch.reduce((acc, cur) => {
        if (acc && cur) {
          return acc + cur;
        }
      })

      return killParticipationSum && Math.round(killParticipationSum / totalGames);
    }
  }

  const summonerKda = currentSummonerMatchData && calculateKdaStats(currentSummonerMatchData);

  return {
    gameAmounts: {
      ...calculateWinLossStats(currentSummonerMatchData),
      totalGames,
    },
    kda: summonerKda,
    averageKillParticipation: averageKillParticipation(),
    topPlayedChampions: udpatedTopPlayedChampionsData,
    preferredPosition: summonerPositionPlayPercentage
  };
}