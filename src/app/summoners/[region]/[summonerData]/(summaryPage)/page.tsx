'use client';

import { useParams } from 'next/navigation';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import type { TSummonerPageParams } from '@/app/_types/types';
import QueueTypes from './QueueTypes';
import SummonerRank from './_summonerRank/SummonerRank';
import SummonerChampionsMastery from '@/app/_components/summonerChampionsMastery/SummonerChampionsMastery';

const Page = () => {
  const params = useParams<TSummonerPageParams>();
  const currentRegionData = getRegionDataFromParams(params.region);

  return (
    <>
      <QueueTypes />
      <div className='mt-2'>
        <div className='w-[332px]'>
          <SummonerRank
            currentRegionData={currentRegionData}
            queueType={'RANKED_SOLO_5x5'}
            smallDataStyle={false}
          />
          <SummonerRank
            currentRegionData={currentRegionData}
            queueType={'RANKED_FLEX_SR'}
            smallDataStyle
          />
          <SummonerChampionsMastery currentRegionData={currentRegionData} />
        </div>
      </div>
    </>
  );
}

export default Page;