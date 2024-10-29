import { getRouteHandlerParams, routeHandlerEndpoints } from '@/app/_lib/utils/routeHandlers';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import {
  calculateAverageKdaStats,
  calculatePercentage,
  segregateSummonersToTeams,
  calculateWinLossStats
} from '@/app/_lib/utils/matchStats';
import type { NextRequest } from 'next/server';
import { TChampion, type TMatchHistory } from '@/app/_types/apiTypes';
import type { TChampionWinLostRatio, TKda } from '@/app/_types/customApiTypes/championStats';

interface TChampionPerformance extends TKda, Omit<TChampionWinLostRatio, 'winRatio'> {
  playAmount: number;
}

type TChampionPerformanceKey = {
  [key: string]: TChampionPerformance;
}

type TPositionPlayAmount = {
  [key: string]: Pick<TChampionPerformance, 'playAmount'>;
}

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionContinentLink, markedChampionId } = getRouteHandlerParams(req);

  const matchHistoryData = await fetchApi<Array<TMatchHistory>>(
    routeHandlerEndpoints.summonerMatchHistory(summonerPuuid, regionContinentLink)
  );

  const currentSummonerMatchData = matchHistoryData?.flatMap((match) =>
    match?.info.participants.filter((participant) => (participant.puuid === summonerPuuid))
  );
  const currentSummonerChampionIds = currentSummonerMatchData?.map((match) => match.championId);

  const matchesForMarkedChampion = currentSummonerMatchData?.filter((match) => {
    const markedChampionIdNum = parseInt(markedChampionId || '');
    return markedChampionIdNum === 0 ? match : match.championId === markedChampionIdNum;
  });
  const markedChampionIds = matchesForMarkedChampion?.map((match) => match.championId);

  const summonerKda = matchesForMarkedChampion && calculateAverageKdaStats(matchesForMarkedChampion);

  const championsForMarkedMatches = await fetchApi<Array<TChampion>>(
    routeHandlerEndpoints.filteredChampions(markedChampionIds)
  );
  const summonerAllPlayedChampions = await fetchApi<Array<TChampion>>(
    routeHandlerEndpoints.filteredChampions(currentSummonerChampionIds)
  );

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
      kda: calculateAverageKdaStats([championData]).kda
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

  return Response.json({
    gameAmounts: {
      ...calculateWinLossStats(matchesForMarkedChampion),
      totalGames
    },
    kda: summonerKda,
    averageKillParticipation: averageKillParticipation(),
    topPlayedChampions: udpatedTopPlayedChampionsData,
    preferredPosition: summonerPositionPlayPercentage,
    playedChampions: sortedChampionData,
  });
}