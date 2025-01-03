import type {
  TChampionStats,
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

export interface TSummonerChampionStats extends Omit<TChampionStats, 'championId'>, Pick<TSummonerMatchHistoryData, 'goldEarned' | 'kills' | 'deaths' | 'totalDamageDealtToChampions'> {
  kda: TAverageKdaStats;
  played: TChampionWinLostRatio,
  minions: {
    averageKilledMinions: number,
    minionsPerMinute: string
  };
  championRank: number;
  championId: string;
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
  championId: number;
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
  averageKillParticipation: number;
  topPlayedChampions: Array<{
    championId: string;
    kda: number;
    playAmount: number;
  } & TChampionWinLostRatio>;
  preferredPosition: Array<{
    position: string;
    playedPercentage: number;
  }>;
  championIds: Array<string> | undefined;
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