import { RouteHandlerParams } from '../_enums/routeHandler';
import type { NextRequest } from 'next/server';

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