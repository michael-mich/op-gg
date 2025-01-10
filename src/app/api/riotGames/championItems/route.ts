import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { ONE_DAY } from '@/app/_constants/timeUnits';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

type TChampionItem = {
  data: Record<number, {
    name: string;
  } & Pick<TChampion, 'image'>>;
}

export const revalidate = ONE_DAY;

export const GET = async () => {
  const newestGameVersion = await fetchApi<string>(riotGamesRoutes.newestGameVersion());
  const itemsData = await fetchApi<TChampionItem>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/item.json`);
  return Response.json(itemsData?.data);
}