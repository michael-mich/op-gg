import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';

const useGameVersionQuery = () => {
  return useQuery({
    queryKey: ['newestGameVersion'],
    queryFn: () => fetchApi<string>(riotGamesRoutes.newestGameVersion()),
    staleTime: 24 * 60 * 60 * 1000 // 1 day
  });
}

export default useGameVersionQuery;