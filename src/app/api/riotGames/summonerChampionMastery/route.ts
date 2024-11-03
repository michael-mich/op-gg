import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesApiKey } from '@/app/_utils/envVariables';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import type { NextRequest } from 'next/server';
import type { TChampionMastery } from '@/app/_types/apiTypes';

export const GET = async (req: NextRequest) => {
  const { regionLink, summonerPuuid, getTopChampions } = getRouteHandlerParams(req);

  const championMasteryData = await fetchApi<Array<TChampionMastery>>(`https://${regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);
  const topFourChampions = championMasteryData?.slice(0, 4);
  return Response.json(getTopChampions === 'true' ? topFourChampions : championMasteryData);
}