import { riotGamesApiKey } from '@/app/_utils/envVariables';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TLiveGame } from '@/app/_types/apiTypes/apiTypes';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink } = getRouteHandlerParams(req);

  const spectatorData = await fetchApi<TLiveGame>(`https://${regionLink}/lol/spectator/v5/active-games/by-summoner/${summonerPuuid}?api_key=${riotGamesApiKey}`);
  return Response.json(spectatorData);
}