import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TSummonerSpell } from '@/app/_types/apiTypes/apiTypes';

export const GET = async () => {
  const newestGameVersion = await fetchApi<string>(riotGamesRoutes.newestGameVersion());
  const spellData = await fetchApi<TSummonerSpell>(`https://ddragon.leagueoflegends.com/cdn/${newestGameVersion}/data/en_US/summoner.json`);
  if (spellData) {
    return Response.json(Object.values(spellData.data));
  }
}