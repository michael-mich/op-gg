import { pandascoreApiKey } from '@/app/_lib/utils/envVariables';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import type { TEsportMatch } from '@/app/_types/apiTypes';

export const GET = async () => {
  const matchLionsVsFnaticData = await fetchApi<TEsportMatch>(`https://api.pandascore.co/matches/636351?token=${pandascoreApiKey}`);
  return Response.json(matchLionsVsFnaticData);
}