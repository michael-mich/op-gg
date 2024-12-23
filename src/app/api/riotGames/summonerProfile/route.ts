import { RIOT_GAMES_API_KEY } from '@/app/_constants/constants';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink } = getRouteHandlerParams(req);

  const summonerProfileData = await fetchApi(`https://${regionLink}/lol/summoner/v4/summoners/by-puuid/${summonerPuuid}?api_key=${RIOT_GAMES_API_KEY}`);
  return Response.json(summonerProfileData);
}