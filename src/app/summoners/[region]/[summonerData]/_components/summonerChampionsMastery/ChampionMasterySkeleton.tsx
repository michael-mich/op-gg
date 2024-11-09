import { Skeleton } from '@nextui-org/react';

type Props = {
  getTopChampions: boolean;
}

const ChampionMasterySkeleton = ({ getTopChampions }: Props) => {
  const skeletons = Array(getTopChampions ? 4 : 8).fill('');

  return (
    <div className='flex gap-2 p-3'>
      {skeletons.map((_, index) => (
        <div className='flex-1 flex flex-col items-center' key={index}>
          <div>
            <Skeleton className={`${getTopChampions ? 'size-10' : 'size-[60px]'} object-contain rounded`} />
          </div>
          <Skeleton className='h-2 w-3/5 rounded-lg mt-4' />
          <Skeleton className='h-2 w-3/5 rounded-lg mt-2' />
        </div>
      ))}
    </div>
  );
}

export default ChampionMasterySkeleton;