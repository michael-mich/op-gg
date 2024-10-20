'use server';

import { getFilteredChampions, getSummonerMatchHistoryData } from '../services/riotGamesApi';
import {
  calculateWinLossStats,
  calculateKdaStats,
  segregateSummonersToTeams,
  calculatePercentage,
  findCurrentSummonerData
} from '../utils/matchStats';
import type { TRecetGames } from '@/app/_types/serverActions/serverActions';
import type { TKda, TChampionWinLostRatio } from '@/app/_types/serverActions/championStats';
import type { TRegionData } from '@/app/_types/types';

interface TChampionPerformance extends TKda, Omit<TChampionWinLostRatio, 'winRatio'> {
  playAmount: number;
}

type TChampionPerformanceKey = {
  [key: string]: TChampionPerformance;
}

type TPositionPlayAmount = {
  [key: string]: Pick<TChampionPerformance, 'playAmount'>;
}

export const getRecentGamesSummary = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined,
  markedChampionId: number
): Promise<TRecetGames | undefined> => {
  const matchHistoryData = await getSummonerMatchHistoryData(regionData, summonerPuuid);

  const currentSummonerMatchData = findCurrentSummonerData(matchHistoryData, summonerPuuid);
  const matchesForMarkedChampion = currentSummonerMatchData?.filter((match) => {
    return markedChampionId === 0 ? match : match.championId === markedChampionId;
  });

  const championsForMarkedMatches = await getFilteredChampions(matchesForMarkedChampion);
  const summonerAllPlayedChampions = await getFilteredChampions(currentSummonerMatchData);

  const sortedChampionData = summonerAllPlayedChampions?.sort((a, b) => {
    const indexA = currentSummonerMatchData?.findIndex((match) => match.championId === parseInt(a.key));
    const indexB = currentSummonerMatchData?.findIndex((match) => match.championId === parseInt(b.key));

    return (indexA || 0) - (indexB || 0);
  });

  const totalGames = (matchesForMarkedChampion && matchesForMarkedChampion.length) as number | undefined;

  const summonerPositionPlayAmount = matchesForMarkedChampion?.reduce((championStats, match) => {
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

  const summonerChampionPerformance = matchesForMarkedChampion?.reduce((championStats, match) => {
    const { kills, deaths, assists, championId } = match;
    let championData = championStats[championId];

    if (!championData) {
      championData = championStats[championId] = {
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
    const recentlyPlayedChampions = Object.entries(summonerChampionPerformance || {});
    const descendingOrder = recentlyPlayedChampions.sort((a, b) => b[1].playAmount - a[1].playAmount);
    return descendingOrder.slice(0, 3);
  }

  const udpatedTopPlayedChampionsData = topPlayedChampions().map(([championId, championData]) => {
    const matchedChampion = championsForMarkedMatches?.find((champion) => champion.key === championId);

    return {
      ...championData,
      championDetails: { image: matchedChampion?.image, name: matchedChampion?.name },
      winRatio: calculatePercentage(championData.wonMatches, championData.playAmount),
      kda: calculateKdaStats([championData]).kda
    };
  });

  const summonersIntoTeams = matchHistoryData?.map((match) => segregateSummonersToTeams(match.info.participants));

  const teamKillsPerMatch = summonersIntoTeams?.map((team) => {
    const teamsWithCurrentSummoner = team.find((teamData) => teamData.teamParticipants.some((participant) => {
      return participant.puuid === summonerPuuid;
    }));

    return teamsWithCurrentSummoner?.teamParticipants.reduce((acc, { kills }) => {
      return acc + kills
    }, 0);
  });

  const killParticipationForEachMatch = matchesForMarkedChampion?.map((summonerData, index) => {
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

  const summonerKda = matchesForMarkedChampion && calculateKdaStats(matchesForMarkedChampion);

  return {
    gameAmounts: {
      ...calculateWinLossStats(matchesForMarkedChampion),
      totalGames
    },
    kda: summonerKda,
    averageKillParticipation: averageKillParticipation(),
    topPlayedChampions: udpatedTopPlayedChampionsData,
    preferredPosition: summonerPositionPlayPercentage,
    playedChampions: sortedChampionData,
  };
}