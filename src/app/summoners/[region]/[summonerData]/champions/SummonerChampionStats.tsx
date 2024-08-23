'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerChampionStats } from '@/app/_lib/api/riotGamesApi/summonerChampionStats';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import type { TSummonerPageParams } from '@/app/_types/types';

const SummonerChampionStats = () => {
  const params = useParams<TSummonerPageParams>();
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = getRegionDataFromParams(params.region);

  const { data: championsStats, refetch: refetchTestMatch, isError } = useQuery({
    enabled: false,
    queryKey: ['matchData', 'summonerPage', summonerPuuid],
    queryFn: () => getSummonerChampionStats(currentRegionData, summonerPuuid)
  });

  useEffect(() => {
    if (summonerPuuid) {
      refetchTestMatch();
    }
  }, [summonerPuuid]);

  if (isError) {
    return <p>error</p>
  }

  return (
    <div className="bg-white dark:bg-darkMode-mediumGray rounded mt-2">
      <p>Champion stats</p>
    </div>
  );
}

export default SummonerChampionStats;