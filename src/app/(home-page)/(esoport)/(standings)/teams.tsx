import { FC } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getLecSpringSeason } from '../../../_lib/api';
import Loading from '@/app/_components/loading';
import ErrorMessage from '@/app/_components/error-message';

const Teams: FC = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['lec'],
    queryFn: () => getLecSpringSeason()
  });

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorMessage />
  }

  return (
    <div className='rounded-bl-md'>
      {data !== undefined
        ?
        data.slice(0, 6).map((data, index) => (
          <div
            className={`flex items-center justify-between ${index !== 5 && 'border-bottom-theme'} py-3.5 
            px-3 transition-colors hover:bg-lightMode-lighterGray dark:hover:bg-darkMode-darkGray`}
            key={index}
          >
            <div className='flex items-center gap-2'>
              <span className='text-xs font-bold'>
                {data.rank}
              </span>
              <Image
                className='max-w-6'
                src={data.team.image_url}
                width={25}
                height={25}
                alt={data.team.acronym}
              />
              <span className='text-xs font-bold'>
                {data.team.acronym
                }</span>
            </div>
            <p className='text-xs font-bold'>
              {data.wins}W {data.losses}L
            </p>
          </div>
        ))
        :
        <p className='flex justify-center items-center text-center h-full'>
          Error to fetch data, try refresh page
        </p>
      }
    </div>
  );
}

export default Teams;