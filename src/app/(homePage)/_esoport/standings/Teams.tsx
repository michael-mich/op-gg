import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { pandascoreRoutes } from '@/app/_constants/endpoints';
import { fetchApi } from '@/app/_utils/fetchApi';
import type { TLecSpringSeason } from '@/app/_types/apiTypes/apiTypes';
import { LuLoader } from 'react-icons/lu';

const Teams = () => {
  const { data, isError, isPending } = useQuery({
    queryKey: ['lec'],
    queryFn: () => fetchApi<Array<TLecSpringSeason>>(pandascoreRoutes.lecSpringSeason()),
    staleTime: Infinity
  });

  return (
    <div className={`grow flex flex-col ${(isPending || isError) && 'justify-center items-center'} rounded-bl-md`}>
      {isPending ? (
        <LuLoader className='size-5 text-secondGray' />
      ) : (
        isError ? (
          <p>Something went wrong</p>
        ) : (
          data ? (
            data.slice(0, 6).map((data, index) => (
              <div
                className={`grow flex items-center justify-between ${index !== 5 ? 'border-bottom-theme' : 'border-b border-b-transparent rounded-bl-md'}
                px-3 transition-colors hover:bg-lightMode-lighterGray dark:hover:bg-darkMode-darkGray`}
                key={index}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-bold'>
                    {data?.rank}
                  </span>
                  <Image
                    className='max-w-6'
                    src={data?.team.image_url || ''}
                    width={25}
                    height={25}
                    alt={data?.team.acronym || ''}
                  />
                  <span className='text-xs font-bold'>
                    {data?.team.acronym}</span>
                </div>
                <p className='text-xs font-bold'>
                  {data?.wins}W {data?.losses}L
                </p>
              </div>
            ))
          ) : (
            <p className='flex justify-center items-center text-center h-full'>
              Error to fetch data, try refresh page
            </p>
          )
        )
      )}
    </div>
  );
}

export default Teams;