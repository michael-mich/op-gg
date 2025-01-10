import type {
  TDetailedLiveGameSummoner,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';

export const isDetailedMatchHistory = (
  summoner: TDetailedLiveGameSummoner | TSummonerDetailedMatchHistory | undefined
): summoner is TSummonerDetailedMatchHistory => {
  return (summoner as TSummonerDetailedMatchHistory | undefined)?.champLevel !== undefined;
}