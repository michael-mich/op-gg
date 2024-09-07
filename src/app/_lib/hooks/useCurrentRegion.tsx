import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import type { TSummonerPageParams, TRegionData } from '@/app/_types/types';
import { allRegionsData } from '@/app/_data/allRegionsData';

const useCurrentRegion = (): TRegionData | undefined => {
  const params = useParams<TSummonerPageParams>();
  const currentRegionData = useMemo(() => {
    return allRegionsData.find((region) => (region.shorthand.toLowerCase() === params.region))
  }, [params.region]);

  return currentRegionData;
}

export default useCurrentRegion;