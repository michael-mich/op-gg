import { fetchApi } from '@/app/_utils/fetchApi';
import type { TSummonerSpell } from '@/app/_types/apiTypes/apiTypes';

export const GET = async () => {
  const spellData = await fetchApi<TSummonerSpell>('https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/summoner.json');
  if (spellData) {
    return Response.json(Object.values(spellData.data));
  }
}