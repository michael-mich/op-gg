import type {
  TUpdatedLiveGameParticipants,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';

export const isDetailedMatchHistory = (
  summoner: TUpdatedLiveGameParticipants | TSummonerDetailedMatchHistory | undefined
): summoner is TSummonerDetailedMatchHistory => {
  return (summoner as TSummonerDetailedMatchHistory | undefined)?.champLevel !== undefined;
}