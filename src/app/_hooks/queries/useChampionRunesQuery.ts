import { fetchApi } from '@/app/_utils/fetchApi';
import { useQuery } from '@tanstack/react-query';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TRune } from '@/app/_types/apiTypes/apiTypes';

const useChampionRunesQuery = () => {
  return useQuery({
    queryKey: ['championRunes'],
    queryFn: () => fetchApi<Array<TRune>>(riotGamesRoutes.runes()),
    staleTime: Infinity,
    gcTime: 600_000 // 10 minutes
  });
}

export default useChampionRunesQuery;