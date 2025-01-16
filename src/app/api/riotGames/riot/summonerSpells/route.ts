import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '../../../../_constants/endpoints';
import { ONE_DAY } from '@/app/_constants/timeUnits';
import type { TSummonerSpell } from '@/app/_types/apiTypes/apiTypes';

export const revalidate = ONE_DAY;

export const GET = async () => {
  const newestGameVersion = await fetchApi<string>(riotGamesRoutes.newestGameVersion());
  const spellData = await fetchApi<TSummonerSpell>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/summoner.json`);
  return Response.json(Object.values(spellData?.data || {}));
}