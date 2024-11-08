import { PANDASCORE_API_KEY } from '@/app/_constants/constants';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { TLecSpringSeason } from '@/app/_types/apiTypes/apiTypes';

export const GET = async () => {
  const lecSpringSeasonData = await fetchApi<Array<TLecSpringSeason>>(`https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${PANDASCORE_API_KEY}`);
  return Response.json(lecSpringSeasonData);
}