import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '../../../../_constants/endpoints';
import { ONE_DAY } from '@/app/_constants/timeUnits';
import type { TRune } from '@/app/_types/apiTypes/apiTypes';

export const revalidate = ONE_DAY;

export const GET = async () => {
  const newestGameVersion = await fetchApi<string>(riotGamesRoutes.newestGameVersion());
  const runesData = await fetchApi<Array<TRune>>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/runesReforged.json`);
  return Response.json(runesData);
}