import { Skeleton } from '@nextui-org/react';

const ChampionMasterySkeleton = () => {
  const skeletons = Array(4).fill('');

  return (
    <div className='flex gap-2 p-3'>
      {skeletons.map((_, index) => (
        <div className='flex-1 flex flex-col items-center' key={index}>
          <div>
            <Skeleton className='size-10 rounded' />
          </div>
          <Skeleton className='h-2 w-3/5 rounded-lg mt-4' />
          <Skeleton className='h-2 w-3/5 rounded-lg mt-2' />
        </div>
      ))}
    </div>
  );
}

export default ChampionMasterySkeleton;