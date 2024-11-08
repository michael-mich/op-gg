import { PANDASCORE_API_KEY } from '@/app/_constants/constants';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { TEsportMatch } from '@/app/_types/apiTypes/apiTypes';

export const GET = async () => {
  const matchLionsVsFnaticData = await fetchApi<TEsportMatch>(`https://api.pandascore.co/matches/636351?token=${PANDASCORE_API_KEY}`);
  return Response.json(matchLionsVsFnaticData);
}