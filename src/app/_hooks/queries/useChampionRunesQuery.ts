import { fetchApi } from '@/app/_utils/fetchApi';
import { useQuery } from '@tanstack/react-query';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { TEN_MINUTES } from '@/app/_constants/timeUnits';
import type { TRune } from '@/app/_types/apiTypes/apiTypes';

const useChampionRunesQuery = () => {
  return useQuery({
    queryKey: ['championRunes'],
    queryFn: () => fetchApi<Array<TRune>>(riotGamesRoutes.runes()),
    staleTime: Infinity,
    gcTime: TEN_MINUTES
  });
}

export default useChampionRunesQuery;