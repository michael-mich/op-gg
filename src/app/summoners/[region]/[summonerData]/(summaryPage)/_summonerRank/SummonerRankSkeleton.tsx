import { Skeleton } from '@nextui-org/react';

type Props = {
  smallDataStyle: boolean;
}

const SummonerRankSkeleton = ({ smallDataStyle }: Props) => {
  return (
    <div className={`w-[332px] ${smallDataStyle ? 'h-[99px]' : 'h-[131px]'} px-3`}>
      <div className='flex items-center h-[35px]'>
        <Skeleton className='h-2 w-3/5 rounded-lg' />
      </div>
      <div className={`flex items-center ${smallDataStyle ? 'gap-2' : 'gap-4'} py-3`}>
        <div>
          <Skeleton className={`flex rounded-full ${smallDataStyle ? 'size-[40px]' : 'size-[72px]'}`} />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <Skeleton className={`${smallDataStyle ? 'h-2' : 'h-3'} w-5/5 rounded-lg`} />
          <Skeleton className={`${smallDataStyle ? 'h-2' : 'h-3'} w-4/5 rounded-lg`} />
        </div>
      </div>
    </div>
  );
}

export default SummonerRankSkeleton;