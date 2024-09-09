'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerRank } from '@/app/_lib/api/riotGamesApi/riotGamesApi';
import type { TSummonerRank } from '@/app/_types/apiTypes';
import { rankedEmblems } from './rankedEmblemsData';
import SummonerRankSkeleton from './SummonerRankSkeleton';

type Props = {
  queueType: string;
  smallDataStyle: boolean;
}

const SummonerRank = ({ queueType, smallDataStyle }: Props) => {
  const currentRegionData = useCurrentRegion();
  const summonerId = useAppSelector((state) => state.summonerId.summonerId);

  const { data: fetchedSummonerRanksData, isLoading, isRefetching } = useQuery({
    queryKey: ['summonerRank', summonerId],
    queryFn: () => getSummonerRank(currentRegionData, summonerId)
  });

  const rankedData: TSummonerRank | undefined = fetchedSummonerRanksData?.find((data) => data.queueType === queueType);

  const calculateWinRate = (): number => {
    const wins = rankedData?.wins || 0;
    const losses = rankedData?.losses || 0;
    const winRate = (wins / (wins + losses) * 100);

    return Math.round(winRate);
  }

  const formatTierName = (): string => {
    if (rankedData) {
      const tierName = rankedData.tier;
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

  const tierName = formatTierName();
  const winRate = calculateWinRate();
  const rankedEmblem = getRankedEmblem();

  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded mt-2'>
      {(isLoading || summonerId === '' || isRefetching)
        ?
        <SummonerRankSkeleton smallDataStyle={smallDataStyle} />
        :
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-3'>
            <span className='text-sm'>{queueType === 'RANKED_SOLO_5x5' ? 'Ranked Solo' : 'Ranked Flex'}</span>
            {!rankedData &&
              <span className='text-sm text-[#c3cbd1] dark:text-[#515163]'>Unranked</span>
            }
          </div>
          {rankedData &&
            <div className='flex items-center justify-between p-3'>
              <div className={`flex items-center ${smallDataStyle ? 'gap-2' : 'gap-4'}`}>
                <div className={`${smallDataStyle ? 'size-[40px]' : 'size-[72px]'} bg-lightMode-lighterGray dark:bg-darkMode-darkGray aspect-square rounded-full`}>
                  <Image
                    className={`${smallDataStyle ? 'size-[40px] p-[0.1rem]' : 'size-[72px] p-2'}`}
                    src={rankedEmblem as string}
                    width={smallDataStyle ? 40 : 72}
                    height={smallDataStyle ? 40 : 72}
                    alt={tierName}
                  />
                </div>
                <div>
                  <span className={`${smallDataStyle ? 'text-sm' : 'text-xl'} block font-bold`}>
                    {tierName} {!['Grandmaster', 'Master', 'Challanger'].includes(tierName) && rankedData?.rank}
                  </span>
                  <span className='block text-xs text-lightMode-mediumGray dark:text-darkMode-lighterGray'>
                    {rankedData!.leaguePoints} LP
                  </span>
                </div>
              </div>
              <div>
                <span className={`${smallDataStyle ? 'leading-5' : 'leading-7'} block text-xs text-end text-secondGray dark:text-darkMode-secondMediumGray`}>
                  {rankedData!.wins}W {rankedData!.losses}L
                </span>
                <span className='block text-xs text-secondGray dark:text-darkMode-secondMediumGray'>
                  Win rate {winRate}%
                </span>
              </div>
            </div>
          }
        </>
      }
    </div>
  );
}

export default SummonerRank;