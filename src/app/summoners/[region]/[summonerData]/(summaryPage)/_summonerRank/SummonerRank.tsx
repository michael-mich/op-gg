'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerRank } from '@/app/_lib/services/riotGamesApi';
import { findQueueTypeData } from '@/app/_lib/utils/utils';
import { calculateWinRate, formatTierName, getRankedEmblem } from '@/app/_lib/utils/rank';
import SummonerRankSkeleton from './SummonerRankSkeleton';
import type { TSummonerRank } from '@/app/_types/services';
import { QueueType } from '@/app/_enums/enums';

type Props = {
  queueType: QueueType;
  smallDataStyle: boolean;
}

const SummonerRank = ({ queueType, smallDataStyle }: Props) => {
  const currentRegionData = useCurrentRegion();
  const summonerId = useAppSelector((state) => state.summonerId.summonerId);

  const { data: fetchedSummonerRanksData, isPending } = useQuery({
    enabled: !!summonerId,
    queryKey: ['summonerRank', summonerId],
    queryFn: () => getSummonerRank(currentRegionData, summonerId),
    refetchOnWindowFocus: false
  });

  const rankedData: TSummonerRank | undefined = findQueueTypeData(fetchedSummonerRanksData, queueType);

  const tierName = formatTierName(rankedData);
  const winRate = calculateWinRate(rankedData);
  const rankedEmblem = getRankedEmblem(rankedData);

  return (
    <div className='bg-white dark:bg-darkMode-mediumGray rounded'>
      {isPending ? (
        <SummonerRankSkeleton smallDataStyle={smallDataStyle} />
      ) : (
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-3'>
            <span className='text-sm'>{queueType === 'RANKED_SOLO_5x5' ? 'Ranked Solo' : 'Ranked Flex'}</span>
            {!rankedData && (
              <span className='text-sm text-[#c3cbd1] dark:text-[#515163]'>Unranked</span>
            )}
          </div>
          {rankedData && (
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
          )}
        </>
      )}
    </div>
  );
}

export default SummonerRank;