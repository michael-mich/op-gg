import { Skeleton } from '@nextui-org/react';

const SummonerLinkSkeleton = () => {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='rounded-image size-9' />
      <div>
        <Skeleton className='w-16 h-1.5 rounded-md' />
        <Skeleton className='w-8 h-1.5 rounded-md mt-2.5' />
      </div>
    </div>
  );
}

export default SummonerLinkSkeleton;