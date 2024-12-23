import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TChampionMastery, TChampionMasterySummary } from '@/app/_types/apiTypes/apiTypes';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink, getTopChampions = 'true' } = getRouteHandlerParams(req);

  const championMasteryData = await fetchApi<Array<TChampionMastery>>(
    riotGamesRoutes.summonerChampionMastery(summonerPuuid, regionLink, getTopChampions)
  );

  const totalChampionPoints = championMasteryData?.reduce((acc, cur) => acc + cur.championPoints, 0).toLocaleString();
  const totalMasteryScore = championMasteryData?.reduce((acc, cur) => acc + cur.championLevel, 0);

  const championMasterySummary: TChampionMasterySummary = {
    masteryChampionsAmount: championMasteryData?.length,
    totalChampionPoints,
    totalMasteryScore
  };

  return Response.json(championMasterySummary);
}