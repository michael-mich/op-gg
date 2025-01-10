import { fetchApi } from '@/app/_utils/fetchApi';
import { ONE_DAY } from '@/app/_constants/timeUnits';

export const revalidate = ONE_DAY;

export const GET = async () => {
  const gameVersions = await fetchApi<Array<string>>(`https://ddragon.leagueoflegends.com/api/versions.json`);
  return Response.json(gameVersions?.[0]);
}