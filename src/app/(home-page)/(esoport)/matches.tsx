'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getMatchResultLionsVsFnatic, getMatchResultFnaticVsBds } from '@/app/_lib/api';
import Loading from '@/app/_components/loading';
import ErrorMessage from '@/app/_components/error-message';

const Matches: FC = () => {
  const {
    data: firstMatchData,
    error: firstMatchError,
    isLoading: firstMatchLoading
  } = useQuery({
    queryKey: ['lec-match', 1],
    queryFn: () => getMatchResultLionsVsFnatic()
  });
  const {
    data: secondMatchData,
    error: secondMatchError,
    isLoading: secondMatchLoading
  } = useQuery({
    queryKey: ['lec-match', 2],
    queryFn: () => getMatchResultFnaticVsBds()
  });
  const matchesData = [firstMatchData, secondMatchData];

  if (firstMatchLoading || secondMatchLoading) {
    return <Loading />
  }

  if (firstMatchError || secondMatchError) {
    return <ErrorMessage />
  }

  return (
    <div className='flex flex-col w-full border-l border-l-lightMode-lighterGray dark:border-l-darkMode-darkBlue'>
      <div className='flex justify-between flex-col h-[59px] border-bottom-theme pt-2 px-3'>
        <h4 className='text-sm font-bold w-full'>Schedule</h4>
        <span className='text-right w-full text-sm pb-2'>
          2024.07.09 TUE
        </span>
      </div>
      <div className='grow flex flex-col'>
        {(firstMatchData && secondMatchData)
          ?
          matchesData.map((match) => match!.games.map((_, gameIndex) => (
            <div
              className='grow flex items-center justify-center flex-col h-full first-of-type:border-bottom-theme'
              key={gameIndex}
            >
              <div className='flex items-center justify-center gap-6'>
                <Image
                  className='max-w-12'
                  src={match!.opponents[0].opponent.image_url}
                  width={50}
                  height={50}
                  alt=''
                />
                <div className='flex items-center gap-2'>
                  <strong className='text-2xl'>
                    {match!.results[0].score}
                  </strong>
                  <span className='text-xs'>vs</span>
                  <strong className='text-2xl'>
                    {match!.results[1].score}
                  </strong>
                </div>
                <Image
                  className='max-w-12'
                  src={match!.opponents[1].opponent.image_url}
                  width={50}
                  height={50}
                  alt=''
                />
              </div>
            </div>
          )))
          :
          <p className='flex justify-center items-center text-center h-full'>
            Error to fetch data, try refresh page
          </p>
        }
      </div>
    </div>
  );
}

export default Matches;