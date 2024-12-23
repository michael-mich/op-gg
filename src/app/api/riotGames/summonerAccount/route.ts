import { RIOT_GAMES_API_KEY } from '@/app/_constants/constants';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TSummonerAccount } from '@/app/_types/apiTypes/apiTypes';

export const GET = async (req: NextRequest) => {
  const { summonerName, regionContinentLink, regionShorthand } = getRouteHandlerParams(req);

  const summonerAccountData = await fetchApi<TSummonerAccount>(`https://${regionContinentLink}/riot/account/v1/accounts/by-riot-id/${summonerName}/${regionShorthand}?api_key=${RIOT_GAMES_API_KEY}`);
  return Response.json(summonerAccountData);
}