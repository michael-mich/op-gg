'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';
import useCurrentRegion from '@/app/_hooks/useCurrentRegion';
import { useAppDispatch } from '@/app/_hooks/useReduxHooks';
import { setSummonerId } from '@/app/_lib/features/summonerIdSlice';
import { setSummonerPuuid } from '@/app/_lib/features/summonerPuuidSlice';
import { useQuery } from '@tanstack/react-query';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type { TLocalStorageSummoner, TSummonerPageParams } from '@/app/_types/types';
import SummonerHeaderSkeleton from './Skeleton';
import FavoriteSummonerButton from './FavoriteSummonerButton';
import PageNavigation from './PageNavigation';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TSummonerProfile, TSummonerAccount } from '@/app/_types/apiTypes/apiTypes';

const SummonerHeader = () => {
  const params = useParams<TSummonerPageParams>();
  const dispatch = useAppDispatch();
  const currentRegionData = useCurrentRegion();

  const summonerName = params.summonerData.replace('-', ' ').split(' ')[0];

  const { data: newestGameVersion } = useGameVersionQuery();

  const {
    data: summonerAccountData,
    isFetched: isSummonerAccountDataFetched,
    isError: isSummonerAccountDataError,
    isPending: isSummonerAccountDataPending,
  } = useQuery({
    queryKey: ['summonerAccount', 'summonerPage', summonerName, params.region],
    queryFn: () => {
      return fetchApi<TSummonerAccount>(
        riotGamesRoutes.summonerAccount(summonerName, currentRegionData?.continentLink, currentRegionData?.shorthand)
      );
    }
  });

  const {
    data: summonerProfileData,
    isError: isSummonerProfileError,
    isSuccess: isSuccessProfile,
    isPending: isSummonerProfilePending,
  } = useQuery({
    enabled: !!summonerAccountData?.puuid,
    queryKey: ['summonerProfile', 'summonerPage', summonerAccountData?.puuid],
    queryFn: () => {
      return fetchApi<TSummonerProfile>(
        riotGamesRoutes.summonerProfile(summonerAccountData?.puuid, currentRegionData?.regionLink)
      );
    }
  });

  const favoriteSummonerData: TLocalStorageSummoner = {
    regionShorthand: currentRegionData?.shorthand,
    summonerName: summonerAccountData?.gameName,
    tagLine: summonerAccountData?.tagLine,
    summonerId: summonerProfileData?.id
  }

  useEffect(() => {
    if (isSuccessProfile) {
      dispatch(setSummonerId(summonerProfileData?.id));
      dispatch(setSummonerPuuid(summonerAccountData?.puuid));
    }
  }, [isSuccessProfile, summonerProfileData?.id]);

  if (isSummonerAccountDataError || isSummonerProfileError) {
    return <p>Error</p>
  }

  if (!currentRegionData) {
    notFound();
  }

  return (
    <section className='bg-white dark:bg-darkMode-mediumGray pt-12'>
      <div className='border-bottom-theme'>
        <div className='w-[1080px] m-auto'>
          {(isSummonerAccountDataPending || isSummonerProfilePending) ? (
            <SummonerHeaderSkeleton />
          ) : (
            <div className='flex gap-6 pb-8'>
              <div className='flex flex-col'>
                <Image
                  className='w-24 aspect-square object-contain rounded-2xl'
                  src={`${imageEndpoints.summonerProfileIcon(newestGameVersion)}${summonerProfileData?.profileIconId}.png`}
                  width={20}
                  height={20}
                  placeholder='blur'
                  blurDataURL='/placeholder/question-mark.webp'
                  alt=''
                  aria-hidden='true'
                />
                <span className='level mt-[-11px] m-auto'>
                  {summonerProfileData?.summonerLevel}
                </span>
              </div>
              <div>
                <div>
                  <span className='text-2xl font-bold'>{summonerAccountData?.gameName} </span>
                  <span className='text-2xl text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>#{summonerAccountData?.tagLine} </span>
                  <FavoriteSummonerButton
                    favoriteSummonerData={favoriteSummonerData}
                    isSummonerAccountDataFetched={isSummonerAccountDataFetched}
                  />
                </div>
                <div className='mt-1.5'>
                  <div className='flex items-center gap-1'>
                    <Image
                      className='w-6'
                      src={currentRegionData ? currentRegionData!.image : ''}
                      width={20}
                      height={20}
                      alt=''
                    />
                    <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                      {summonerAccountData?.tagLine}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <PageNavigation />
    </section >
  );
}

export default SummonerHeader;