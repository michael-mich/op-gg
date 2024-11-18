import { RIOT_GAMES_API_KEY } from '@/app/_constants/constants';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { NextRequest } from 'next/server';
import type { TMatchHistory } from '@/app/_types/apiTypes/apiTypes';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';

export const GET = async (req: NextRequest) => {
  const {
    summonerPuuid,
    regionContinentLink,
    matchHistoryCount,
    matchHistoryStartIndex
  } = getRouteHandlerParams(req);

  const matchIds = await fetchApi<Array<string>>(`https://${regionContinentLink}/lol/match/v5/matches/by-puuid/${summonerPuuid}/ids?start=${matchHistoryStartIndex}&count=${matchHistoryCount}&api_key=${RIOT_GAMES_API_KEY}`);
  const matchHistoryData = [] as Array<TMatchHistory>;

  // for loop is used to sequentially fetch detailed match data
  if (matchIds) {
    for (const id of matchIds) {
      const matchData = await fetchApi<TMatchHistory>(`https://${regionContinentLink}/lol/match/v5/matches/${id}?api_key=${RIOT_GAMES_API_KEY}`);
      matchData && matchHistoryData.push(matchData);
    };
  }

  return Response.json(matchHistoryData);
}