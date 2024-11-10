import { fetchApi } from '@/app/_utils/fetchApi';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import type { NextRequest } from 'next/server';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

export const GET = async (req: NextRequest) => {
  const { championIds } = getRouteHandlerParams(req);

  const data = await fetchApi<{ data: Record<string, TChampion> }>('https://ddragon.leagueoflegends.com/cdn/14.22.1/data/en_US/champion.json');
  const champions = Object.values(data?.data || []);

  const filteredChampions: Array<TChampion> = champions.filter((champion) => championIds?.some((id) =>
    champion.key === id.toString())
  );

  return Response.json(filteredChampions);
}