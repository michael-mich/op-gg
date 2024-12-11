import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { TEN_MINUTES } from '@/app/_constants/timeUnits';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

const useChampionDataQuery = () => {
  return useQuery({
    queryKey: ['championData'],
    queryFn: () => fetchApi<Array<TChampion>>(riotGamesRoutes.championData()),
    staleTime: Infinity,
    gcTime: TEN_MINUTES
  });
}

export default useChampionDataQuery;