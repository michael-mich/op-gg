import { getDifferenceBetweenCurrentDate, calculatePercentage } from './utils';
import type { TSummonerMatchHistoryData, TMatchHistory } from '../_types/apiTypes/apiTypes';
import type {
  TChampionWinLostRatio,
  TAverageKdaStats,
  TTeamGeneric
} from '../_types/apiTypes/customApiTypes';
import { QueueId } from '../_enums/queue';

type TSummonerData = Array<Pick<TSummonerMatchHistoryData, 'assists' | 'deaths' | 'kills'>>;

export const filterMatchesByMonths = (matchHistory: Array<TMatchHistory> | undefined) => {
  const maxMonthsSinceLastMatchPlay = 6;
  return matchHistory?.filter((match) => {
    const { monthsDifference } = getDifferenceBetweenCurrentDate(match.info.gameEndTimestamp);
    return monthsDifference <= maxMonthsSinceLastMatchPlay;
  });
}

export const isRecognizedQueueId = (matchHistory: Array<TMatchHistory> | undefined) => {
  return matchHistory?.filter((match) => {
    const queueIdEntries = Object.entries(QueueId);
    const numericQueueIds = queueIdEntries.filter(([key]) => !isNaN(parseInt(key)));
    return numericQueueIds.some(([key]) => parseInt(key) === match.info.queueId);
  });
}

export const calculateWinLossStats = (
  matchData: Array<Pick<TSummonerMatchHistoryData, 'win' | 'gameEndedInEarlySurrender'>> | undefined
): TChampionWinLostRatio => {
  let wonMatches = 0;
  let lostMatches = 0;

  matchData?.forEach((summoner) => {
    if (summoner.win && !summoner.gameEndedInEarlySurrender) {
      wonMatches++;
    } else if (!summoner.gameEndedInEarlySurrender) {
      lostMatches++;
    }
  });

  const winRatio = matchData ? calculatePercentage(wonMatches, matchData.length) : 0;

  return {
    winRatio,
    wonMatches,
    lostMatches
  };
}

export const calculateAverageKdaStats = (summonerData: TSummonerData): TAverageKdaStats => {
  const { assists: totalAssists, deaths: totalDeaths, kills: totalKills } = summonerData.reduce(
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
    kda,
    averageKills: (totalKills / summonerData.length).toFixed(1),
    averageAssists: (totalAssists / summonerData.length).toFixed(1),
    averageDeaths: (totalDeaths / summonerData.length).toFixed(1)
  };
}

export const segregateSummonersToTeams = <T extends { teamId: number }>(
  matchParticipants: Array<T> | undefined
) => {
  const teams: Array<TTeamGeneric<T>> = [
    { teamType: 'blue', teamParticipants: [] },
    { teamType: 'red', teamParticipants: [] }
  ];

  for (const summoner of matchParticipants || []) {
    if (summoner.teamId === 100) {
      teams[0].teamParticipants.push(summoner);
    } else {
      teams[1].teamParticipants.push(summoner);
    }
  }

  return teams;
}