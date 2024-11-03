import { pandascoreApiKey } from '@/app/_utils/envVariables';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { TEsportMatch } from '@/app/_types/apiTypes';

export const GET = async () => {
  const matchLionsVsFnaticData = await fetchApi<TEsportMatch>(`https://api.pandascore.co/matches/636351?token=${pandascoreApiKey}`);
  return Response.json(matchLionsVsFnaticData);
}