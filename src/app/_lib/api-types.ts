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
  opponents: Array<{ opponent: TEsportTeam }>;
  results: Array<{ score: number }>
}