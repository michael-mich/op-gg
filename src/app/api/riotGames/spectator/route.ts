import { riotGamesApiKey } from '@/app/_lib/utils/envVariables';
import { getRouteHandlerParams } from '@/app/_lib/utils/routeHandlers';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TLiveGame } from '@/app/_types/apiTypes';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink } = getRouteHandlerParams(req);

  const spectatorData = await fetchApi<TLiveGame>(`https://${regionLink}/lol/spectator/v5/active-games/by-summoner/${summonerPuuid}?api_key=${riotGamesApiKey}`);
  return Response.json(spectatorData);
}