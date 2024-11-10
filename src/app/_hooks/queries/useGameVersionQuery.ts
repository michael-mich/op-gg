import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';

const useGameVersion = () => {
  return useQuery({
    queryKey: ['newestGameVersion'],
    queryFn: () => fetchApi<string>(riotGamesRoutes.newestGameVersion()),
    staleTime: 24 * 60 * 60 * 1000
  });
}

export default useGameVersion;