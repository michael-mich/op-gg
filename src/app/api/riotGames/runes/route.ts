import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TRune } from '@/app/_types/apiTypes/apiTypes';

export const GET = async () => {
  const newestGameVersion = await fetchApi(riotGamesRoutes.newestGameVersion());
  const runesData = await fetchApi<Array<TRune>>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/runesReforged.json`);
  return Response.json(runesData);
}