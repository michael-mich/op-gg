import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '../../../../_constants/endpoints';
import { ONE_DAY } from '@/app/_constants/timeUnits';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

export const revalidate = ONE_DAY;

export const GET = async () => {
  const newestGameVersion = await fetchApi<string>(riotGamesRoutes.newestGameVersion());

  const data = await fetchApi<{ data: Record<string, TChampion> }>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/champion.json`);
  const champions = Object.values(data?.data || {});

  return Response.json(champions);
}