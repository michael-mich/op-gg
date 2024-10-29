import { pandascoreApiKey } from '@/app/_lib/utils/envVariables';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { TEsportMatch } from '@/app/_types/apiTypes';

export const GET = async () => {
  const matchFnaticVsBdsData = await fetchApi<TEsportMatch>(`https://api.pandascore.co/matches/636358?token=${pandascoreApiKey}`);
  return Response.json(matchFnaticVsBdsData);
}