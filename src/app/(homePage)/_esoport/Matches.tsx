'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import { routeHandlerEndpoints } from '@/app/_lib/utils/routeHandlers';
import type { TEsportMatch } from '@/app/_types/apiTypes';
import { LuLoader } from 'react-icons/lu';

const Matches = () => {
  const {
    data: firstMatchData,
    isError: isFirstMatchError,
    isPending: isFirstMatchPending,
  } = useQuery({
    queryKey: ['lec-match', 1],
    queryFn: async () => {
      return await fetchApi<TEsportMatch>(
        routeHandlerEndpoints.matchResultLionsVsFnatic()
      );
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });

  const {
    data: secondMatchData,
    isError: isSecondMatchError,
    isPending: isSecondMatchPending,
  } = useQuery({
    queryKey: ['lec-match', 2],
    queryFn: async () => {
      return await fetchApi<TEsportMatch>(routeHandlerEndpoints.matchResultFnaticVsBds());
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });

  const matchesData = [firstMatchData, secondMatchData];

  return (
    <div className='flex flex-col w-full border-l border-l-lightMode-lighterGray dark:border-l-darkMode-darkBlue'>
      <div className='flex justify-between flex-col h-[59px] border-bottom-theme pt-2 px-3'>
        <h4 className='text-sm font-bold w-full'>Schedule</h4>
        <span className='text-right w-full text-sm pb-2'>
          2024.07.09 TUE
        </span>
      </div>
      <div className={`grow flex flex-col ${(isFirstMatchPending || isSecondMatchPending || isFirstMatchError || isSecondMatchError) && 'justify-center items-center'}`}>
        {(isFirstMatchPending || isSecondMatchPending) ? (
          <LuLoader className='size-5 text-secondGray' />
        ) : (
          (isFirstMatchError || isSecondMatchError) ? (
            <p>Something went wrong</p>
          ) : (
            matchesData.length > 0 ? (
              matchesData.map((match) => match!.games.map((_, gameIndex) => {
                const matchSchedule = new Date(match!.original_scheduled_at);
                const matchDay = matchSchedule.getDate();
                const matchMonth = matchSchedule.getMonth() + 1;
                const matchHour = matchSchedule.getHours();
                const matchMinutes = matchSchedule.getMinutes();

                return (
                  <div
                    className='grow flex place-content-center gap-4 flex-col h-full [&:nth-child(2)]:rounded-br-md
                first-of-type:border-bottom-theme px-6 transition-colors hover:bg-lightMode-lighterGray dark:hover:bg-darkMode-darkGray'
                    key={gameIndex}
                  >
                    <div className='flex items-center justify-between w-full'>
                      <div className='grow'>
                        <Image
                          className='max-w-10 m-auto'
                          src={match!.opponents[0].opponent.image_url}
                          width={50}
                          height={50}
                          alt=''
                        />
                      </div>
                      <div className='grow flex place-content-center gap-3'>
                        <strong className='text-2xl'>
                          {match!.results[0].score}
                        </strong>
                        <span className='self-center text-xs'>vs</span>
                        <strong className='text-2xl'>
                          {match!.results[1].score}
                        </strong>
                      </div>
                      <div className='grow'>
                        <Image
                          className='max-w-10 m-auto'
                          src={match!.opponents[1].opponent.image_url}
                          width={50}
                          height={50}
                          alt=''
                        />
                      </div>
                    </div>
                    <div className='flex items-center justify-between w-full'>
                      <div className='grow basis-[40px] text-center'>
                        <span className='font-bold'>
                          {match!.opponents[0].opponent.acronym}
                        </span>
                      </div>
                      <div className='flex flex-col text-center w-[88.79px]'>
                        <span className='text-xs text-darkMode-lighterGray'>
                          {`${matchDay}.${matchMonth}`}
                        </span>
                        <span className='text-sm leading-[.875rem]'>
                          {`${matchHour}:${matchMinutes}0`}
                        </span>
                      </div>
                      <div className='grow basis-[40px] text-center'>
                        <span className='font-bold'>
                          {match!.opponents[1].opponent.acronym}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }))
            ) : (
              <p className='flex justify-center items-center text-center h-full'>
                Error to fetch data, try refresh page
              </p>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Matches;