'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerRank } from '@/app/_lib/api/riotGamesApi';
import { getRegionDataFromParams } from '@/app/_lib/utils';
import { TSummonerPageParams } from '@/app/_types/types';
import { rankedEmblems } from './summonerRankData';

const SummonerRank = () => {
  const params = useParams<TSummonerPageParams>();
  const summonerId = useAppSelector((state) => state.summonerId.summonerId);

  const currentRegionData = getRegionDataFromParams(params.region);

  const { data, refetch } = useQuery({
    enabled: false,
    queryKey: ['summonerRank'],
    queryFn: () => getSummonerRank(currentRegionData, summonerId)
  });

  const formatTierName = () => {
    if (data?.length) {
      const tierName = data[0].tier;

      return `${tierName[0]}${tierName.slice(1).toLowerCase()}`;
    }
    else {
      return '';
    }
  }

  const getRankedEmblem = (): string | undefined => {
    return rankedEmblems.find((emblem) => {
      const tierName = emblem.replaceAll('/', ' ').replace('.', ' ').split(' ')[2];
      return tierName === formatTierName();
    });
  }

  useEffect(() => {
    if (summonerId) {
      refetch();
    }
  }, [summonerId]);

  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded'>
      <div className='flex items-center justify-between h-[35px] border-bottom-theme px-3'>
        <span className='text-sm'>Ranked Solo</span>
        {data?.length === 0 &&
          <span className='text-sm'>Unranked</span>
        }
      </div>
      {data?.length &&
        <div className='flex items-center justify-between p-3'>
          <div className='flex items-center gap-4'>
            <div className='bg-lightMode-lighterGray dark:bg-darkMode-darkBlue aspect-square rounded-full'>
              <Image
                className='size-[72px] p-2'
                src={getRankedEmblem() as string}
                width={70}
                height={70}
                alt={formatTierName()}
              />
            </div>
            <div>
              <span className='block text-xl font-bold'>{formatTierName()}</span>
              <span className='block text-xs'>{data[0].leaguePoints} LP</span>
            </div>
          </div>
          <div>
            <span className='block text-xs leading-7'>
              {data[0].wins}W {data[0].losses}L
            </span>
            <span className='block text-xs'>Win rate 61%</span>
          </div>
        </div>
      }
    </div>
  );
}

export default SummonerRank;