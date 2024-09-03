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