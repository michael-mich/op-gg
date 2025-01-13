import { fetchApi } from '@/app/_utils/fetchApi';
import { RIOT_GAMES_API_KEY } from '@/app/_constants/constants';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import type { NextRequest } from 'next/server';
import type { TChampionMastery } from '@/app/_types/apiTypes/apiTypes';

export const GET = async (req: NextRequest) => {
  const { regionLink, summonerPuuid, getTopChampions } = getRouteHandlerParams(req);

  const championMasteryData = await fetchApi<Array<TChampionMastery>>(`https://${regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${RIOT_GAMES_API_KEY}`);
  return Response.json(getTopChampions === 'true' ? championMasteryData?.slice(0, 4) : championMasteryData);
}