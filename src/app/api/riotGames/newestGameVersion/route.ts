import { fetchApi } from '@/app/_utils/fetchApi';

export const GET = async () => {
  const gameVersions = await fetchApi<Array<string>>(`https://ddragon.leagueoflegends.com/api/versions.json?timestamp=${Date.now()}`);
  return Response.json(gameVersions?.[0]);
}