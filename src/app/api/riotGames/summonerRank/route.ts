import { riotGamesApiKey } from '@/app/_lib/utils/envVariables';
import { getRouteHandlerParams } from '@/app/_lib/utils/routeHandlers';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TSummonerRank } from '@/app/_types/apiTypes';

export const GET = async (req: NextRequest) => {
  const { summonerId, regionLink } = getRouteHandlerParams(req);

  const summonerRankData = await fetchApi<Array<TSummonerRank>>(`https://${regionLink}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${riotGamesApiKey}`);
  return Response.json(summonerRankData);
}