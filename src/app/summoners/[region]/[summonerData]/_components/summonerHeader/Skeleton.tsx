import { Skeleton } from '@nextui-org/react';

const SummonerHeaderSkeleton = () => {
  return (
    <div className='max-w-[300px] w-full flex gap-6 pb-8'>
      <div>
        <Skeleton className='flex rounded-2xl size-24' />
      </div>
      <div className='w-full flex flex-col gap-2 mt-2'>
        <Skeleton className='h-3 w-4/5 rounded-lg mb-1.5' />
        <Skeleton className='h-3 w-3/5 rounded-lg' />
      </div>
    </div>
  );
}

export default SummonerHeaderSkeleton;