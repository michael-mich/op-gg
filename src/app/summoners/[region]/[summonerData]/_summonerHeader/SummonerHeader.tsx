'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/_lib/hooks/reduxHooks';
import { setSummonerId } from '@/app/_lib/features/summonerIdSlice';
import { setSummonerPuuid } from '@/app/_lib/features/summonerPuuidSlice';
import { useQuery } from '@tanstack/react-query';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import { getSummonerProfileData, getSummonerAccount } from '@/app/_lib/api/riotGamesApi';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import type { TLocalStorageSummoner, TSummonerPageParams } from '@/app/_types/types';
import SummonerHeaderSkeleton from './Skeleton';
import FavoriteSummonerButton from './FavoriteSummonerButton';
import PageNavigation from './PageNavigation';

const SummonerHeader = () => {
  const params = useParams<TSummonerPageParams>();
  const dispatch = useAppDispatch();

  const summonerTagLine = params.region;
  const summonerName = params.summonerData.replace('-', ' ').split(' ')[0];
  const currentRegionData = getRegionDataFromParams(summonerTagLine);

  const {
    data: summonerAccountData,
    isFetched: fetchedSummonerAccountData,
    isError: summonerAccountDataError,
    isLoading: summonerAccountDataLoading
  } = useQuery({
    queryKey: ['summonerAccount', 'summonersPage'],
    queryFn: () => getSummonerAccount(summonerName, currentRegionData)
  });

  const {
    data: summonerProfileData,
    refetch: refetchSummonerProfileData,
    isFetched: fetchedSummonerProfileData
  } = useQuery({
    enabled: false,
    queryKey: ['summonerProfile', 'summonersPage'],
    queryFn: () => getSummonerProfileData(summonerAccountData as TSummonerAccount, currentRegionData)
  });

  const favoriteSummonerData: TLocalStorageSummoner = {
    regionShorthand: currentRegionData?.shorthand,
    summonerName: summonerAccountData?.gameName,
    tagLine: summonerAccountData?.tagLine,
    summonerId: summonerProfileData?.id
  }

  if (!currentRegionData || summonerAccountDataError) {
    notFound();
  }

  useEffect(() => {
    if (fetchedSummonerAccountData) {
      refetchSummonerProfileData();
    }
  }, [fetchedSummonerAccountData, summonerAccountData?.puuid]);

  useEffect(() => {
    if (fetchedSummonerProfileData) {
      dispatch(setSummonerId(summonerProfileData?.id));
      dispatch(setSummonerPuuid(summonerAccountData?.puuid));
    }
  }, [fetchedSummonerProfileData, summonerProfileData?.id]);

  return (
    <section className='bg-white dark:bg-darkMode-mediumGray pt-12'>
      <div className='border-bottom-theme'>
        <div className='w-[1080px] m-auto'>
          {summonerAccountDataLoading
            ?
            <SummonerHeaderSkeleton />
            :
            <div className='flex gap-6 pb-8'>
              <div className='flex flex-col'>
                <Image
                  className='w-24 aspect-square object-contain rounded-2xl'
                  src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${summonerProfileData?.profileIconId}.png`}
                  width={20}
                  height={20}
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
                    fetchedSummonerAccountData={fetchedSummonerAccountData}
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
          }
        </div>
      </div>
      <PageNavigation
        summonerTagLine={summonerTagLine}
        summonerName={summonerName}
      />
    </section >
  );
}

export default SummonerHeader;