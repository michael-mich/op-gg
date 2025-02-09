import type {
  TChampionStats,
  TSummonerRank,
  TLiveGameSummoner,
  TLiveGame,
  TSummonerMatchHistoryData,
  TMatchHistory
} from './apiTypes';

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

export interface TDetailedLiveGameSummoner extends TLiveGameSummoner {
  bannedChampion: Pick<TLiveGameSummoner, 'championId'>;
  rank: TSummonerRank | undefined;
  riotId: string;
  summonerLevel: number | undefined;
  shardIds: Array<number>;
}

export interface TDetailedLiveGame extends Pick<TLiveGame, 'gameLength'> {
  gameQueueConfigId: number;
  teams: Array<{
    teamType: 'blue' | 'red',
    teamParticipants: Array<TDetailedLiveGameSummoner>
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
  rank: TSummonerRank | undefined;
}

export type TDetailedMatchHistory = {
  info: Omit<TMatchHistory['info'], 'participants'> & {
    participants: Array<TTeamGeneric<TSummonerDetailedMatchHistory>>;
  };
}