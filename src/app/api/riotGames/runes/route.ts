import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { TRune } from '@/app/_types/apiTypes';

export const dynamic = 'force-static';

export const GET = async () => {
  const runesData = await fetchApi<Array<TRune>>('https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/runesReforged.json');
  return Response.json(runesData);
}