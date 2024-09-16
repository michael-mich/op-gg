import { RuneType } from "../_enums/enums";

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
  games: Array<{}>;
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

export type TChampionStats = {
  championId: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

export interface TMatchParticipantStats extends TChampionStats {
  championName: string;
  puuid: string;
  assists: number;
  deaths: number;
  kills: number;
  win: boolean;
  totalMinionsKilled: number;
  gameDuration: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
}

export type TMatchData = {
  info: {
    gameDuration: number;
    participants: Array<Omit<TMatchParticipantStats, 'gameDuration'>>;
  }
}
export interface TSummonerChampionStats extends TChampionStats {
  kda: {
    kda: number,
    averageKills: string,
    averageAssists: string,
    averageDeaths: string
  };
  played: {
    winRatio: number,
    wonMatches: number,
    lostMatches: number
  };
  minions: {
    averageKilledMinions: number,
    minionsPerMinute: string
  };
  totalGold: number;
  maxKills: number;
  maxDeaths: number;
  averageDamageDealt: number;
}

export type TChampionMasterySummary = {
  masteryChampionsAmount: number | undefined;
  totalChampionPoints: string | undefined;
  totalMasteryScore: number | undefined;
}

export interface TLiveGameParticipants extends Pick<TSummonerAccount, 'puuid'>, Pick<TChampionMastery, 'championId'>, Pick<TSummonerProfile, 'profileIconId'> {
  spell1Id: number;
  spell2Id: number;
  perks: {
    perkIds: Array<number>;
    perkStyle: number;
    perkSubStyle: number;
  };
  summonerId: string;
  teamId: number;
}

export type TLiveGame = {
  gameMode: string;
  gameLength: number;
  participants: Array<TLiveGameParticipants>;
  bannedChampions: Array<Pick<TLiveGameParticipants, 'teamId' | 'championId'>>;
}

export interface TSummonerSpellContent extends Pick<TChampion, 'key'> {
  name: string;
}

export type TSummonerSpell = {
  data: Record<string, TSummonerSpellContent>
}

export type TRune = {
  id: number;
  icon: string;
  name: string;
  key: string;
  type: RuneType;
  slots: Array<{
    runes: Array<{
      id: number;
      icon: string
      name: string
      key: string;
      longDesc: string;
      shortDesc: string;
    }>;
  }>;
};

export interface TUpdatedLiveGameParticipants extends Pick<TLiveGameParticipants, 'teamId'> {
  championData: {
    name: string;
    image: string;
  } | undefined;
  summonerName: string | undefined;
  summonerLevel: number | undefined;
  runes: Array<TRune | undefined>;
  rank: TSummonerRank | undefined,
  spells: Array<TSummonerSpellContent> | undefined,
  bannedChampion: {
    championName: string | undefined;
    championId: number;
    teamId: number;
  } | undefined;
}

export type TTeams = {
  blueTeam: Array<TUpdatedLiveGameParticipants>;
  redTeam: Array<TUpdatedLiveGameParticipants>;
}

export interface TSegregateTeams extends Pick<TLiveGame, 'gameLength'> {
  teams: Array<TTeams>;
}