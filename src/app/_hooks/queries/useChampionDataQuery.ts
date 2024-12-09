import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

type TChampionData = {
  [key: string]: TChampion;
}

const useChampionDataQuery = () => {
  return useQuery({
    queryKey: ['championData'],
    queryFn: () => fetchApi<TChampionData>(riotGamesRoutes.championData()),
    staleTime: Infinity,
    gcTime: 60_000
  });
}

export default useChampionDataQuery;