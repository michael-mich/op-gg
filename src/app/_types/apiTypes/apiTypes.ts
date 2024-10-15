import type { TChampionWinLostRatio, TAverageKdaStats } from '../types';
import type { TMatchParticipantStats } from './championStatsTypes';

export type TPromiseResult<T> = T | void | undefined;

type TEsportTeam = {
  acronym: string;
  image_url: string;
}

export type TLecSpringSeason = {
  losses: number;
  rank: number;
  team: TEsportTeam;
  wins: number;
}

export type TEsportMatch = {
  games: Array<unknown>;
  original_scheduled_at: string;
  opponents: Array<{ opponent: TEsportTeam }>;
  results: Array<{ score: number }>
}

export type TSummonerAccount = {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export type TSummonerProfile = {
  summonerLevel: number;
  profileIconId: number;
  id: string;
}

export type TSummonerRank = {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  queueType: string;
}

export type TChampionMastery<T extends string = string> = {
  championId: number;
  championLevel: number;
  championPoints: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  championSeasonMilestone: number;
  lastPlayTime: number;
  nextSeasonMilestone: {
    requireGradeCounts: Record<T, number>;
  }
}

export type TChampion = {
  name: string;
  image: { full: string };
  key: string;
}

export type TChampionMasterySummary = {
  masteryChampionsAmount: number | undefined;
  totalChampionPoints: string | undefined;
  totalMasteryScore: number | undefined;
}

export interface TSummonerMatchHistoryData extends TMatchParticipantStats {
  individualPosition: string;
}

export type TMatchHistory = {
  info: {
    gameDuration: number;
    participants: Array<TSummonerMatchHistoryData>
  }
}

export type TRecetGames = {
  gameAmounts: {
    totalGames: number | undefined;
  } & TChampionWinLostRatio;
  kda: TAverageKdaStats | undefined;
  averageKillParticipation: number | undefined;
  topPlayedChampions: Array<{
    championName: string;
    kda: number;
    playAmount: number;
  } & TChampionWinLostRatio>;
  preferredPosition: Array<{
    position: string;
    playedPercentage: number;
  }>
}