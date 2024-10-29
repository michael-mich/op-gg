import { riotGamesApiKey } from '@/app/_lib/utils/envVariables';
import { getRouteHandlerParams } from '@/app/_lib/utils/routeHandlers';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink } = getRouteHandlerParams(req);

  const summonerProfileData = await fetchApi(`https://${regionLink}/lol/summoner/v4/summoners/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);
  return Response.json(summonerProfileData);
}