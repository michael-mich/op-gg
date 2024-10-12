'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { getRecentGamesData } from '@/app/_lib/api/riotGamesApi/recentGames';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import Summary from './Summary';
import TopThreeChampions from './TopThreeChampions';
import PreferredPosition from './PreferredPosition';
import { CircularProgress } from '@nextui-org/react';

const RecentGames = () => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegion = useCurrentRegion();

  const {
    data: recentGamesData,
    isPending: isRecentGamesPending,
    isSuccess: isRecentGamesSucces,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['recentGames', summonerPuuid],
    queryFn: () => getRecentGamesData(currentRegion, summonerPuuid),
    refetchOnWindowFocus: false,
    retryDelay: 5000
  });

  return (
    <div className='w-full h-fit bg-white dark:bg-darkMode-mediumGray rounded'>
      {isRecentGamesPending ? (
        <CircularProgress aria-label='loading summoner summary of 20 recent games' />
      ) : isRecentGamesSucces ? (
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-3'>
            <span className='text-sm'>RecentGames</span>
            <span className='text-sm'>input</span>
          </div>
          <div className='flex items-baseline py-1 px-3'>
            <Summary recentGamesData={recentGamesData} />
            <TopThreeChampions recentGamesData={recentGamesData} />
            <PreferredPosition />
          </div>
        </>
      ) : (
        <p>error</p>
      )
      }
    </div >
  );
}

export default RecentGames;