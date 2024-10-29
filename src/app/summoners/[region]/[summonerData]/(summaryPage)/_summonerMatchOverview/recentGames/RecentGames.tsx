'use client';

import useCurrentRegion from '@/app/_lib/hooks/useCurrentRegion';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import { routeHandlerEndpoints } from '@/app/_lib/utils/routeHandlers';
import type { TSetState } from '@/app/_types/tuples';
import type { TRecetGames } from '@/app/_types/customApiTypes/customApiTypes';
import Summary from './Summary';
import TopChampions from './TopChampions';
import PreferredPosition from './PreferredPosition';
import SearchChampion from './SearchChampion';
import { CircularProgress } from '@nextui-org/react';

type Props = {
  markedChampionId: string;
  setMarkedChampionId: TSetState<string>;
}

const RecentGames = ({ markedChampionId, setMarkedChampionId }: Props) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { continentLink } = useCurrentRegion() || {};

  const {
    data: recentGamesData,
    isPending: isRecentGamesPending,
    isSuccess: isRecentGamesSucces,
  } = useQuery({
    enabled: !!summonerPuuid,
    queryKey: ['recentGames', summonerPuuid, markedChampionId],
    queryFn: async () => {
      return await fetchApi<TRecetGames>(
        routeHandlerEndpoints.recentGamesSummary(summonerPuuid, continentLink, markedChampionId)
      );
    },
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