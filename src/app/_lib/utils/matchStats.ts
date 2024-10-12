import type { TSummonerMatchHistoryData } from '@/app/_types/apiTypes/apiTypes';
import type { TChampionWinLostRatio, TAverageKdaStats } from '@/app/_types/types';
import type { TTeam } from '@/app/_types/apiTypes/liveGameTypes';

type TSummonerData = Array<Pick<TSummonerMatchHistoryData, 'assists' | 'deaths' | 'kills'>>;

interface TTeamGeneric<T> extends Pick<TTeam, 'teamType'> {
  teamParticipants: Array<T>;
}

export const calculatePercentage = (part: number, total: number): number => {
  return Math.round((part / total) * 100);
}

export const calculateWinLossStats = (matchData: Array<{ win: boolean }> | undefined): TChampionWinLostRatio => {
  let wonMatches = 0;
  let lostMatches = 0;

  matchData?.forEach((data) => {
    if (data.win) {
      wonMatches++;
    }
    else {
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

export const calculateKdaStats = (summonerData: TSummonerData): TAverageKdaStats => {
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
  }
}

export const segregateSummonersToTeams = <T extends { teamId: number }>(matchParticipants: Array<T> | undefined) => {
  const teams: Array<TTeamGeneric<T>> = [
    { teamType: 'blue', teamParticipants: [] },
    { teamType: 'red', teamParticipants: [] }
  ];

  for (let summoner of matchParticipants || []) {
    if (summoner.teamId === 100) {
      teams[0].teamParticipants.push(summoner);
    }
    else {
      teams[1].teamParticipants.push(summoner);
    }
  }

  return teams;
}