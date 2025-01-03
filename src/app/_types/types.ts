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

export type PickNumberProperties<T> = {
  [P in keyof T as T[P] extends number ? P : never]: T[P];
}