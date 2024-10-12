export type TRegionData = {
  name: string;
  shorthand: string;
  image: string;
  regionLink: string;
  continentLink: string;
}

export type TLocalStorageSummoner = {
  regionShorthand: string | undefined;
  summonerName: string | undefined;
  tagLine: string | undefined;
  summonerId: string | undefined;
}

export type TSummonerPageParams = {
  region: string;
  summonerData: string;
}

export type TKda = {
  assists: number;
  deaths: number;
  kills: number;
}

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