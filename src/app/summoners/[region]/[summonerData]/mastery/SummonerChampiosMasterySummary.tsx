'use client';

import { useEffect } from 'react';
import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerChampionsMasterySummary } from '@/app/_lib/api/riotGamesApi/riotGamesApi';
import { CircularProgress } from '@nextui-org/react';

const championMasteryDetails = [
  {
    image: '/icons/points.png',
    text: 'Total mastery score'
  },
  {
    image: '/icons/total-points.png',
    text: 'Total champion points'
  },
  {
    image: '/icons/champion-mastery.png',
    text: 'Mastery champion'
  }
];

const SummonerChampionsMasterySummary = () => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegionData = useCurrentRegion();

  const { data: championSummaryData, refetch: refetchChampionSummaryData, isLoading, isFetched } = useQuery({
    queryKey: ['summonerMasteryTotalData'],
    queryFn: () => getSummonerChampionsMasterySummary(currentRegionData, summonerPuuid)
  });

  useEffect(() => {
    if (summonerPuuid) {
      refetchChampionSummaryData();
    }
  }, [summonerPuuid]);

  return (
    <div className='flex justify-center items-center rounded bg-white dark:bg-darkMode-mediumGray p-3'>
      {(isLoading || !isFetched)
        ?
        <CircularProgress aria-label='loading mastery summary data' />
        :
        championSummaryData
          ?
          championMasteryDetails.map((data, index) => (
            <div
              className={`flex-1 flex flex-col items-center gap-0.5 ${index !== 2 && 'border-r border-r-almostWhite dark:border-r-darkMode-darkBlue'}`}
              key={index}
            >
              <Image
                className='size-6 object-contain'
                src={data.image}
                width={25}
                height={25}
                alt='Total mastery score'
              />
              <span className='font-bold text-sm'>
                {index === 0 ? championSummaryData.totalMasteryScore : index === 1 ? championSummaryData.totalChampionPoints : `${championSummaryData.masteryChampionsAmount} / 168`}
              </span>
              <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                {data.text}
              </span>
            </div>
          ))
          :
          <p>error</p>
      }
    </div>
  );
}

export default SummonerChampionsMasterySummary;