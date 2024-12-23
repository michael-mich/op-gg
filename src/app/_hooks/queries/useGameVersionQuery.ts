import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { TEN_MINUTES } from '@/app/_constants/timeUnits';

const useGameVersionQuery = () => {
  return useQuery({
    queryKey: ['newestGameVersion'],
    queryFn: () => fetchApi<string>(riotGamesRoutes.newestGameVersion()),
    staleTime: 24 * 60 * 60 * 1000, // 1 day
    gcTime: TEN_MINUTES
  });
}

export default useGameVersionQuery;