import type { TSummonerAccount } from '../apiTypes';

export type TKda = {
  assists: number;
  deaths: number;
  kills: number;
}

export type TAverageKdaStats = {
  kda: number,
  averageKills: string,
  averageAssists: string,
  averageDeaths: string
}

export type TChampionWinLostRatio = {
  wonMatches: number;
  lostMatches: number;
  winRatio: number;
}

export type TChampionStats = {
  championId: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

/**
 * Types representing data modified in the summonerChampionStats.ts file
 */
export interface TSummonerChampionStats extends TChampionStats {
  kda: TAverageKdaStats;
  played: TChampionWinLostRatio,
  minions: {
    averageKilledMinions: number,
    minionsPerMinute: string
  };
  totalGold: number;
  maxKills: number;
  maxDeaths: number;
  averageDamageDealt: number;
}

/**
 * Types representing data fetched from Riot Games API
 */
export interface TMatchParticipantStats extends TChampionStats, Pick<TSummonerAccount, 'puuid'>, TKda {
  championName: string;
  win: boolean;
  totalMinionsKilled: number;
  gameDuration: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  teamId: number;
}