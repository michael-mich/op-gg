import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '../../../../_constants/endpoints';
import { fetchApi } from '@/app/_utils/fetchApi';
import { calculatePercentage } from '@/app/_utils/utils';
import {
  calculateAverageKdaStats,
  calculateWinLossStats,
  isRecognizedQueueId,
  filterMatchesByMonths
} from '@/app/_utils/matchRouteUtils';
import type { NextRequest } from 'next/server';
import type { TMatchHistory, TKda } from '@/app/_types/apiTypes/apiTypes';
import type { TChampionWinLostRatio } from '@/app/_types/apiTypes/customApiTypes';

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
  const {
    summonerPuuid,
    regionContinentLink,
    markedChampionId,
    matchHistoryCount
  } = getRouteHandlerParams(req);

  const fetchedMatchHistory = await fetchApi<Array<TMatchHistory>>(
    riotGamesRoutes.summonerMatchHistory(
      summonerPuuid,
      regionContinentLink,
      matchHistoryCount,
      '0'
    )
  );
  const recentMatches = filterMatchesByMonths(fetchedMatchHistory);
  const matchHistoryData = isRecognizedQueueId(recentMatches);

  const currentSummonerMatchData = matchHistoryData?.flatMap((match) =>
    match?.info.participants.filter((participant) => participant.puuid === summonerPuuid)
  );

  const matchesForMarkedChampion = currentSummonerMatchData?.filter((match) => {
    const markedChampionIdNum = parseInt(markedChampionId || '');
    return markedChampionIdNum === 0 ? match : match.championId === markedChampionIdNum;
  });

  const summonerPositionPlayAmount = matchesForMarkedChampion?.reduce((championStats, match) => {
    const { teamPosition } = match;
    const position = teamPosition.toLowerCase();
    let positionData = championStats[position];

    if (position !== '') {
      if (!positionData) {
        positionData = championStats[position] = {
          playAmount: 0
        };
      }
      positionData.playAmount += 1;
    }

    return championStats;
  }, {} as TPositionPlayAmount);

  const matchesWithSummonerPosition = matchesForMarkedChampion?.filter((match) =>
    match.teamPosition !== ''
  );
  const summonerPositionPlayPercentage = Object.entries(summonerPositionPlayAmount || {}).map(([position, data]) => ({
    position,
    playedPercentage: calculatePercentage(data.playAmount, matchesWithSummonerPosition?.length || 0)
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
    if (match.win && !match.gameEndedInEarlySurrender) {
      championData.wonMatches += 1;
    } else if (!match.gameEndedInEarlySurrender) {
      championData.lostMatches += 1;
    }

    return championStats;
  }, {} as TChampionPerformanceKey);

  const topPlayedChampions = () => {
    const recentlyPlayedChampions = Object.entries(summonerChampionPerformance || {});
    const championWithStats = recentlyPlayedChampions.map(([championId, championData]) => ({
      ...championData,
      championId,
      winRatio: calculatePercentage(championData.wonMatches, championData.playAmount),
      kda: calculateAverageKdaStats([championData]).kda
    }));

    const descendingOrder = championWithStats.sort((a, b) => {
      if (b.playAmount === a.playAmount) {
        return b.kda - a.kda;
      } else {
        return b.playAmount - a.playAmount;
      }
    });
    return descendingOrder.slice(0, 3);
  }

  const calculateAverageKillParticipation = () => {
    const totalGames = matchesForMarkedChampion?.filter((match) => !match.gameEndedInEarlySurrender);
    const totalKillParticipation = totalGames?.reduce((acc, summoner) => {
      return acc + summoner.challenges.killParticipation;
    }, 0);

    if (totalKillParticipation && totalGames) {
      return Math.round((totalKillParticipation / totalGames.length) * 100);
    } else {
      return 0;
    }
  }

  const championIds = currentSummonerMatchData?.map((summoner) => summoner.championId.toString());
  const summonerKdaStats = matchesForMarkedChampion && calculateAverageKdaStats(matchesForMarkedChampion);

  return Response.json({
    gameAmounts: {
      ...calculateWinLossStats(matchesForMarkedChampion),
      totalGames: matchesForMarkedChampion?.length
    },
    kda: summonerKdaStats,
    averageKillParticipation: calculateAverageKillParticipation(),
    topPlayedChampions: topPlayedChampions(),
    preferredPosition: summonerPositionPlayPercentage,
    championIds
  });
}