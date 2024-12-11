import type {
  TChampionStats,
  TKda,
  TRuneSlots,
  TRune,
  TSummonerRank,
  TLiveGame,
  TLiveGameParticipants,
  TSummonerAccount,
  TChampion,
  TSummonerSpellContent,
  TSummonerMatchHistoryData,
  TMatchHistory
} from './apiTypes';
import type { RuneType } from '@/app/_enums/match';

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

export interface TUpdatedRune extends Omit<TRune, 'slots'> {
  slots: Array<TRuneSlots>;
  type: RuneType;
}

export type TBannedChampion = {
  name: string;
  image: string;
  championId: number;
  teamId: number;
}

export interface TUpdatedLiveGameParticipants extends Pick<TLiveGameParticipants, 'teamId' | 'perks' | 'spell1Id' | 'spell2Id'>, Pick<TSummonerAccount, 'puuid'> {
  championData: Pick<TChampion, 'name'> & {
    image: string;
  } | undefined;
  summonerNameAndTagLine: {
    name: string | undefined;
    tagLine: string | undefined;
  } | undefined;
  summonerLevel: number | undefined;
  runes: Array<TUpdatedRune | undefined>;
  rank: TSummonerRank | undefined,
  spells: Array<TSummonerSpellContent> | undefined,
  bannedChampion: TBannedChampion | undefined;
  shardIds: Array<number> | undefined;
}

export interface TSummonerLiveGameData extends Pick<TLiveGame, 'gameLength'> {
  teams: Array<{
    teamType: 'blue' | 'red',
    teamParticipants: Array<TUpdatedLiveGameParticipants>
  }>;
}

export type TMatchHistorySummary = {
  gameAmounts: {
    totalGames: number | undefined;
  } & TChampionWinLostRatio;
  kda: TAverageKdaStats | undefined;
  averageKillParticipation: number | undefined;
  topPlayedChampions: Array<{
    championDetails: {
      name: TChampion['name'] | undefined;
      image: TChampion['image'] | undefined
    };
    kda: number;
    playAmount: number;
  } & TChampionWinLostRatio>;
  preferredPosition: Array<{
    position: string;
    playedPercentage: number;
  }>;
  playedChampions: Array<TChampion> | undefined;
}

export interface TTeamGeneric<T> {
  teamType: 'blue' | 'red',
  teamParticipants: Array<T | undefined>;
}

export interface TSummonerDetailedMatchHistory extends TSummonerMatchHistoryData {
  rank: TSummonerRank;
}

export type TDetailedMatchHistory = {
  info: Omit<TMatchHistory['info'], 'participants'> & {
    participants: Array<TTeamGeneric<TSummonerDetailedMatchHistory>>;
  };
}