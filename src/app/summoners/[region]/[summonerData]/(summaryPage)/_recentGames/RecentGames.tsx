'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { getRecentGamesData } from '@/app/_lib/api/riotGamesApi/recentGames';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import Summary from './Summary';
import TopThreeChampions from './TopThreeChampions';
import PreferredPosition from './PreferredPosition';
import { CircularProgress } from '@nextui-org/react';
import { IoIosSearch } from "react-icons/io";

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
    <div className={`${isRecentGamesPending && 'flex items-center justify-center py-12'} w-full h-fit bg-white dark:bg-darkMode-mediumGray rounded`}>
      {isRecentGamesPending ? (
        <CircularProgress aria-label='loading summoner summary of 20 recent games' />
      ) : isRecentGamesSucces ? (
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-1'>
            <span className='text-sm pl-2'>Recent Games</span>
            <div className='flex items-center gap-2 rounded bg-almostWhite dark:bg-darkMode-darkBlue py-0.5 px-2'>
              <IoIosSearch className='size-6 text-secondGray' />
              <input
                className='w-full text-xs bg-transparent outline-none placeholder:opacity-50'
                type='text'
                placeholder='Search a champion'
              />
            </div>
          </div>
          <div className='grid grid-cols-3 py-2 px-3'>
            <Summary recentGamesData={recentGamesData} />
            <TopThreeChampions recentGamesData={recentGamesData} />
            <PreferredPosition recentGamesData={recentGamesData} />
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