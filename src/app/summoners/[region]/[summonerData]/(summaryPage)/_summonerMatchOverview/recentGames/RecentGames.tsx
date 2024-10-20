'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { getRecentGamesSummary } from '@/app/_lib/serverActions/recentGamesSummary';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import type { TSetState } from '@/app/_types/tuples';
import Summary from './Summary';
import TopChampions from './TopChampions';
import PreferredPosition from './PreferredPosition';
import SearchChampion from './SearchChampion';
import { CircularProgress } from '@nextui-org/react';

type Props = {
  markedChampionId: number;
  setMarkedChampionId: TSetState<number>;
}

const RecentGames = ({ markedChampionId, setMarkedChampionId }: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const currentRegion = useCurrentRegion();

  const {
    data: recentGamesData,
    isPending: isRecentGamesPending,
    isSuccess: isRecentGamesSucces,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['recentGames', summonerPuuid, markedChampionId],
    queryFn: () => getRecentGamesSummary(currentRegion, summonerPuuid, markedChampionId),
    refetchOnWindowFocus: false,
    retryDelay: 5000
  });

  return (
    <div className={`${isRecentGamesPending && 'flex items-center justify-center py-12'} w-full 
    h-fit bg-white dark:bg-darkMode-mediumGray rounded`}
    >
      {isRecentGamesPending ? (
        <CircularProgress aria-label='loading summoner summary of 20 recent games' />
      ) : isRecentGamesSucces ? (
        <>
          <div className='flex items-center justify-between h-[35px] border-bottom-theme px-1'>
            <span className='text-sm pl-2'>Recent Games</span>
            <SearchChampion
              recentGamesData={recentGamesData}
              setMarkedChampionId={setMarkedChampionId}
            />
          </div>
          <div className='grid grid-cols-3 py-2 px-3'>
            <Summary recentGamesData={recentGamesData} />
            <TopChampions recentGamesData={recentGamesData} />
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