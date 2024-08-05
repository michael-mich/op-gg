export type TRegionData = {
  name: string;
  shorthand: string;
  image: string;
  regionLink: string;
  continentLink: string;
}

export type TLocalStorageSummoner = {
  regionShorthand: string;
  summonerName: string | undefined;
  tagLine: string | undefined;
  summonerId: string | undefined;
}