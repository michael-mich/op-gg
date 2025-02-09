'use client';

import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesCustomRoutes } from '@/app/_constants/endpoints';
import type { TChampionMasterySummary } from '@/app/_types/apiTypes/apiTypes';
import SummonerChampionMastery from '../_components/summonerChampionsMastery/SummonerChampionMastery';
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


const Page = () => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { regionLink } = useCurrentRegion() || {};

  const { data: championSummaryData, isPending, isSuccess } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['summonerMasteryTotalData', summonerPuuid],
    queryFn: () => {
      return fetchApi<TChampionMasterySummary>(
        riotGamesCustomRoutes.summonerChampionsMasterySummary(summonerPuuid, regionLink)
      );
    }
  });

  return (
    <>
      <div className='flex justify-center items-center rounded bg-white dark:bg-darkMode-mediumGray p-3 mb-2'>
        {isPending ? (
          <CircularProgress aria-label='loading mastery summary data' />
        ) : (
          isSuccess ? (
            championMasteryDetails.map((data, index) => (
              <div
                className={`flex-1 flex flex-col items-center gap-0.5 
                ${index !== 2 && 'border-r border-r-almostWhite dark:border-r-darkMode-darkBlue'}`}
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
                  {index === 0 ? championSummaryData?.totalMasteryScore : index === 1 ? championSummaryData?.totalChampionPoints : `${championSummaryData?.masteryChampionsAmount} / 168`}
                </span>
                <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                  {data.text}
                </span>
              </div>
            ))
          ) : (
            <p>error</p>
          )
        )}
      </div>
      <SummonerChampionMastery getTopChampions={false} />
    </>
  )
}

export default Page;