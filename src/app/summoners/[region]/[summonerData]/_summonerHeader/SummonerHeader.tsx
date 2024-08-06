'use client';

import Image from 'next/image';
import { usePathname, notFound } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { regionData } from '@/app/_data/regionData';
import { getSummonerProfileData, getSummonerAccount } from '@/app/_lib/api/riotGamesApi';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import type { TRegionData, TLocalStorageSummoner } from '@/app/_types/types';
import SummonerHeaderSkeleton from './Skeleton';
import FavoriteSummonerButton from './FavoriteSummonerButton';
import PageNavigation from './PageNavigation';

const SummonerHeader = () => {
  const pathname = usePathname();
  const summonerTagLine = pathname.replaceAll('/', ' ').split(' ')[2];
  const summonerName = pathname.replaceAll('/', ' ').split(' ')[3].replace('-', ' ').split(' ')[0].replaceAll('%20', ' ');

  const getCurrentRegionData = (): TRegionData | undefined => {
    return regionData.find((region) => (region.shorthand.toLowerCase() === summonerTagLine));
  }

  const currentRegionData = getCurrentRegionData();

  const {
    data: summonerAccountData,
    isFetched: fetchedSummonerAccountData,
    isError: summonerAccountDataError,
    isLoading,
  } = useQuery({
    queryKey: ['summonerAccount', 'summonersPage'],
    queryFn: () => getSummonerAccount(summonerName, currentRegionData)
  });

  const { data: summonerProfileData, refetch: refetchSummonerProfileData } = useQuery({
    enabled: false,
    queryKey: ['summonerProfile', 'summonersPage'],
    queryFn: () => getSummonerProfileData(summonerAccountData as TSummonerAccount, currentRegionData)
  });

  const favoriteSummonerData: TLocalStorageSummoner = {
    regionShorthand: currentRegionData!.shorthand,
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

  return (
    <section className='bg-white dark:bg-darkMode-mediumGray pt-12'>
      <div className='w-[1080px] m-auto'>
        {isLoading
          ?
          <SummonerHeaderSkeleton />
          :
          <div className='flex gap-6 pb-8'>
            <div className='relative'>
              <Image
                className='w-24 aspect-square object-contain rounded-2xl'
                src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${summonerProfileData?.profileIconId}.png`}
                width={20}
                height={20}
                alt=''
                aria-hidden='true'
              />
              <span className='absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2 z-10 text-xs 
              text-white bg-[#202d37] rounded-xl py-[.1rem] px-2'
              >
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
                  summonerProfileData={summonerProfileData}
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
      <PageNavigation
        summonerTagLine={summonerTagLine}
        summonerName={summonerName}
      />
    </section >
  );
}

export default SummonerHeader;