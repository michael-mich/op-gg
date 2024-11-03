import type { TChampionStats, TSummonerAccount, TKda } from '../apiTypes';

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

/**
 * Types for data from the 'championStats' endpoint
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
 * Interface contains types that used to summarize summoner champions stats based on recent matches
 */
export interface TMatchParticipantStats extends TChampionStats, Pick<TSummonerAccount, 'puuid'>, TKda {
  championName: string;
  win: boolean;
  totalMinionsKilled: number;
  gameDuration: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
}