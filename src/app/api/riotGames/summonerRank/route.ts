import { RIOT_GAMES_API_KEY } from '@/app/_constants/constants';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TSummonerRank } from '@/app/_types/apiTypes/apiTypes';

export const GET = async (req: NextRequest) => {
  const { summonerId, regionLink } = getRouteHandlerParams(req);

  const summonerRankData = await fetchApi<Array<TSummonerRank>>(`https://${regionLink}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_GAMES_API_KEY}`);
  return Response.json(summonerRankData);
}