import { pandascoreApiKey } from '@/app/_lib/utils/envVariables';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { TLecSpringSeason } from '@/app/_types/apiTypes';

export const GET = async () => {
  const lecSpringSeasonData = await fetchApi<Array<TLecSpringSeason>>(`https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${pandascoreApiKey}`);
  return Response.json(lecSpringSeasonData);
}