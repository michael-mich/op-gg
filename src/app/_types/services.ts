import type { TMatchParticipantStats } from './serverActions/championStats';

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
  champLevel: number;
}

export type TMatchHistory = {
  info: {
    gameDuration: number;
    gameEndTimestamp: number;
    gameType: string;
    participants: Array<TSummonerMatchHistoryData>
  }
}

export type TSummonerSpellsAndPerks = {
  spell1Id: number;
  spell2Id: number;
  perks: {
    perkIds: Array<number>;
    perkStyle: number;
    perkSubStyle: number;
  };
}

export interface TLiveGameParticipants extends TSummonerSpellsAndPerks {
  puuid: TSummonerAccount['puuid'];
  championId: TChampionMastery['championId'];
  profileIconId: TSummonerProfile['profileIconId'];
  summonerId: string;
  teamId: number;
}

export type TLiveGame = {
  gameMode: string;
  gameLength: number;
  participants: Array<TLiveGameParticipants>;
  bannedChampions: Array<Pick<TLiveGameParticipants, 'teamId' | 'championId'>>;
}

export interface TSummonerSpellContent extends TChampion {
  description: string;
}

export type TSummonerSpell = {
  data: Record<string, TSummonerSpellContent>
}

export interface TRuneSlots extends Pick<TChampion, 'name'> {
  id: number;
  icon: string
  key: string;
  longDesc: string;
  shortDesc: string;
}

export interface TRune extends Omit<TRuneSlots, 'longDesc' | 'shortDesc'> {
  slots: Array<{
    runes: Array<TRuneSlots>;
  }>;
};