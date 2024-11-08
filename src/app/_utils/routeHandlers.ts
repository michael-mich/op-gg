import { baseUrl } from './envVariables';
import type { NextRequest } from 'next/server';

type Nullable<T> = T | undefined | null;

enum RouteHandlers {
  Pandascore = '/api/pandascore',
  RiotGames = '/api/riotGames',
}

enum RouteHandlerParams {
  SummonerPuuid = 'summonerPuuid',
  SummonerId = 'summonerId',
  SummonerName = 'summonerName',
  RegionContinentLink = 'regionContinentLink',
  RegionLink = 'regionLink',
  RegionShorthand = 'regionShorthand',
  GetTopChampions = 'getTopChampions',
  ChampionIds = 'championIds',
  MarkedChampionId = 'markedChampionId',
  MatchesCount = 'matchesCount'
}

export const getRouteHandlerParams = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const summonerPuuid = searchParams.get(RouteHandlerParams.SummonerPuuid);
  const summonerId = searchParams.get(RouteHandlerParams.SummonerId);
  const summonerName = searchParams.get(RouteHandlerParams.SummonerName);
  const regionLink = searchParams.get(RouteHandlerParams.RegionLink);
  const regionContinentLink = searchParams.get(RouteHandlerParams.RegionContinentLink);
  const regionShorthand = searchParams.get(RouteHandlerParams.RegionShorthand)?.toLowerCase();
  const getTopChampions = searchParams.get(RouteHandlerParams.GetTopChampions);
  const championIds = searchParams.get(RouteHandlerParams.ChampionIds)?.split(',');
  const markedChampionId = searchParams.get(RouteHandlerParams.MarkedChampionId);
  const matchesCount = searchParams.get(RouteHandlerParams.MatchesCount);

  return {
    summonerPuuid,
    summonerId,
    summonerName,
    regionLink,
    regionContinentLink,
    regionShorthand,
    getTopChampions,
    championIds,
    markedChampionId,
    matchesCount
  };
}

const routeQueryParams = {
  summonerName: (summonerName: string) => {
    return `${RouteHandlerParams.SummonerName}=${summonerName}`
  },
  summonerId: (summonerId: Nullable<string>) => {
    return `${RouteHandlerParams.SummonerId}=${summonerId}`;
  },
  summonerPuuid: (summonerPuuid: Nullable<string>) => {
    return `${RouteHandlerParams.SummonerPuuid}=${summonerPuuid}`;
  },
  regionLink: (regionLink: Nullable<string>) => {
    return `${RouteHandlerParams.RegionLink}=${regionLink}`;
  },
  regionContinentLink: (regionContinentLink: Nullable<string>) => {
    return `${RouteHandlerParams.RegionContinentLink}=${regionContinentLink}`;
  },
  regionShorthand: (regionShorthand: Nullable<string>) => {
    return `${RouteHandlerParams.RegionShorthand}=${regionShorthand}`;
  },
  getTopChampions: (getTopChampions: boolean) => {
    return `${RouteHandlerParams.GetTopChampions}=${getTopChampions}`;
  },
  championIds: (championIds: Array<number> | undefined) => {
    return `${RouteHandlerParams.ChampionIds}=${championIds?.join(',')}`;
  },
  markedChampionId: (markedChampionId: string) => {
    return `${RouteHandlerParams.MarkedChampionId}=${markedChampionId}`;
  },
  matchesCount: (matchesCount: string | null) => {
    return `${RouteHandlerParams.MatchesCount}=${matchesCount}`;
  }
}

export const routeHandlerEndpoints = {
  lecSpringSeason: () => {
    return `${baseUrl}${RouteHandlers.Pandascore}/lecSpringSeason`;
  },
  matchResultFnaticVsBds: () => {
    return `${baseUrl}${RouteHandlers.Pandascore}/matchResultFnaticVsBds`;
  },
  matchResultLionsVsFnatic: () => {
    return `${baseUrl}${RouteHandlers.Pandascore}/matchResultLionsVsFnatic`;
  },
  runes: () => {
    return `${baseUrl}${RouteHandlers.RiotGames}/runes`;
  },
  summonerAccount: (
    summonerName: string,
    regionContinentLink: Nullable<string>,
    regionShortHand: Nullable<string>
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerAccount?${routeQueryParams.summonerName(summonerName)}&${routeQueryParams.regionContinentLink(regionContinentLink)}&${routeQueryParams.regionShorthand(regionShortHand)}`;
  },
  summonerProfile: (summonerPuuid: Nullable<string>, regionLink: Nullable<string>) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerProfile?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionLink(regionLink)}`;
  },
  summonerRank: (summonerId: Nullable<string>, regionLink: Nullable<string>) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerRank?${routeQueryParams.summonerId(summonerId)}&${routeQueryParams.regionLink(regionLink)}`;
  },
  summonerChampionMastery: (
    summonerPuuid: string | undefined,
    regionLink: string | undefined,
    getTopChampions: boolean
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerChampionMastery?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionLink(regionLink)}&${routeQueryParams.getTopChampions(getTopChampions)}`;
  },
  summonerSpells: () => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerSpells`;
  },
  summonerChampionsMasterySummary: (
    summonerPuuid: string | undefined,
    regionLink: string | undefined
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerChampionsMasterySummary?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionLink(regionLink)}`;
  },
  spectator: (summonerPuuid: Nullable<string>, regionLink: Nullable<string>) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/spectator?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionLink(regionLink)}`;
  },
  filteredChampions: (championIds: Array<number> | undefined) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/filteredChampions?${routeQueryParams.championIds(championIds)}`;
  },
  summonerMatchHistory: (
    summonerPuuid: string | null,
    regionContinentLink: string | null,
    matchesCount: string | null
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/summonerMatchHistory?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionContinentLink(regionContinentLink)}&${routeQueryParams.matchesCount(matchesCount)}`;
  },
  detailedMatchHistory: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    markedChampionId: string,
    mathcesCount: string | null
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/custom/detailedMatchHistory?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionContinentLink(regionContinentLink)}&${routeQueryParams.markedChampionId(markedChampionId)}&${routeQueryParams.matchesCount(mathcesCount)}`;
  },
  recentGamesSummary: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    markedChampionId: string,
    matchesCount: string | null,
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/custom/recentGamesSummary?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionContinentLink(regionContinentLink)}&${routeQueryParams.markedChampionId(markedChampionId)}&${routeQueryParams.matchesCount(matchesCount)}`;
  },
  summonerChampionStats: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    mathcesCount: string | null
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/custom/summonerChampionStats?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionContinentLink(regionContinentLink)}&${routeQueryParams.matchesCount(mathcesCount)}`;
  },
  summonerLiveGame: (
    summonerPuuid: Nullable<string>,
    regionLink: Nullable<string>,
    regionContinentLink: Nullable<string>
  ) => {
    return `${baseUrl}${RouteHandlers.RiotGames}/custom/summonerLiveGame?${routeQueryParams.summonerPuuid(summonerPuuid)}&${routeQueryParams.regionContinentLink(regionContinentLink)}&${routeQueryParams.regionLink(regionLink)}`;
  }
}