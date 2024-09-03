'use client';

import { useParams } from 'next/navigation';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import type { TSummonerPageParams } from '@/app/_types/types';
import SummonerChampionsMasterySummary from './SummonerChampiosMasterySummary';
import SummonerChampionsMastery from '@/app/_components/summonerChampionsMastery/SummonerChampionsMastery';

const Page = () => {
  const params = useParams<TSummonerPageParams>();
  const currentRegionData = getRegionDataFromParams(params.region);

  return (
    <>
      <SummonerChampionsMasterySummary currentRegionData={currentRegionData} />
      <SummonerChampionsMastery currentRegionData={currentRegionData} getTopChampions={false} />
    </>
  )
}

export default Page;