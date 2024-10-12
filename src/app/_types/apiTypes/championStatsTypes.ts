import type { TSummonerAccount } from './apiTypes';
import type { TKda, TChampionWinLostRatio, TAverageKdaStats } from '../types';

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