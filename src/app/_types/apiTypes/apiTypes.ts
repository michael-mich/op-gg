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

export type TKda = {
  assists: number;
  deaths: number;
  kills: number;
}

export type TChampionStats = {
  championId: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
}

export interface TSummonerMatchHistoryData extends TChampionStats, TKda, Pick<TSummonerProfile, 'summonerLevel'> {
  puuid: string;
  totalMinionsKilled: number;
  goldEarned: number;
  win: boolean;
  championName: string;
  individualPosition: string;
  teamPosition: string;
  champLevel: number;
  summonerId: string;
  perks: {
    styles: Array<{
      style: number;
      selections: Array<{
        perk: number;
      }>;
      description: string;
    }>;
  };
  [key: `item${number}`]: number;
  teamEarlySurrendered: boolean;
  neutralMinionsKilled: number;
  gameEndedInEarlySurrender: boolean;
  teamId: number;
  riotIdGameName: string;
  summonerName: string;
  wardsPlaced: number;
  wardsKilled: number;
  visionWardsBoughtInGame: number;
  turretKills: number;
  killingSprees: number;
  riotIdTagline: string;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  challenges: {
    kda: number;
    killParticipation: number;
  };
  summoner1Id: number;
  summoner2Id: number;
}

export type TMatchHistory = {
  info: {
    gameDuration: number;
    gameEndTimestamp: number;
    participants: Array<TSummonerMatchHistoryData>;
    queueId: number;
    gameMode: string;
    teams: Array<
      {
        objectives: {
          [key: string]: {
            kills: number;
          };
        };
        win: boolean;
      } & Pick<TSummonerMatchHistoryData, 'teamId'>
    >;
  }
}

export interface TLiveGameSummoner extends Pick<TSummonerMatchHistoryData, 'summonerId'> {
  puuid: TSummonerAccount['puuid'];
  championId: TChampionMastery['championId'];
  profileIconId: TSummonerProfile['profileIconId'];
  teamId: number;
  perks: {
    perkIds: Array<number>;
    perkStyle: number;
    perkSubStyle: number;
  };
  spell1Id: number;
  spell2Id: number;
}

export type TLiveGame = {
  gameMode: string;
  gameLength: number;
  participants: Array<TLiveGameSummoner>;
  bannedChampions: Array<Pick<TLiveGameSummoner, 'teamId' | 'championId'>>;
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

export type TChampionItem = {
  [key: string]: TChampion;
}