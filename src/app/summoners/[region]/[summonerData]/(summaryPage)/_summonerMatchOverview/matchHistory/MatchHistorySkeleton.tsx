import { Skeleton } from '@nextui-org/react';
import { createEmptyStringArray } from '@/app/_utils/utils';

const fiveElements = createEmptyStringArray(5);
const threeElements = createEmptyStringArray(3);

const items = createEmptyStringArray(7);
const teams = [
  { summoners: fiveElements },
  { summoners: fiveElements }
];

const MatchHistorySkeleton = () => {
  return (
    <div className='mask-element'>
      {fiveElements.map((_, index) => (
        <div
          className='flex w-full h-[100px] bg-white dark:bg-darkMode-mediumGray rounded-[5px] 
          py-1.5 px-2.5 mb-2 last-of-type:mb-0'
          key={index}
        >
          <div className='flex flex-col gap-7 w-[108px]'>
            <div>
              <Skeleton className='h-2 w-3/4 rounded-lg mb-1.5' />
              <Skeleton className='h-2 w-2/4 rounded-lg' />
            </div>
            <div>
              <Skeleton className='h-2 w-2/6 rounded-lg mb-1.5' />
              <Skeleton className='h-2 w-2/6 rounded-lg' />
            </div>
          </div>
          <div className='flex-1 self-center'>
            <div className='flex gap-3'>
              <div className='flex items-center'>
                <Skeleton className='rounded-image size-12' />
                <div className='flex items-center gap-0.5 ml-1'>
                  <div>
                    <Skeleton className='size-[22px] rounded mb-0.5' />
                    <Skeleton className='size-[22px] rounded' />
                  </div>
                  <div>
                    <Skeleton className='rounded-image size-[22px] first-of-type:mb-0.5' />
                    <Skeleton className='rounded-image size-[22px]' />
                  </div>
                </div>
              </div>
              <div className='w-[108px]'>
                <Skeleton className='w-2/4 h-2 rounded-lg mb-1.5' />
                <Skeleton className='w-1/4 h-2 rounded-lg' />
              </div>
              <div className='flex-1'>
                {threeElements.map((_, index) => (
                  <Skeleton className='w-1/3 h-2 rounded-lg mb-1.5' key={index} />
                ))}
              </div>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              <div className='flex gap-0.5'>
                {items.map((_, index) => (
                  <Skeleton
                    className={`${index === 6 ? 'rounded-image' : 'rounded'} size-[22px]`}
                    key={index}
                  />
                ))}
              </div>
              <div className='flex gap-1 max-w-[200px] overflow-x-hidden'>
                {threeElements.map((_, index) => (
                  <Skeleton className='rounded-xl w-20 min-w-20 h-5' key={index} />
                ))}
              </div>
            </div>
          </div>
          <div className='flex gap-2 w-[168px]'>
            {teams.map((team, teamIndex) => (
              <div className='flex-1 flex flex-col gap-0.5' key={teamIndex}>
                {team.summoners.map((_, summonerIndex) => (
                  <div className='flex items-center gap-1' key={summonerIndex}>
                    <Skeleton className='size-4 min-w-4 rounded' />
                    <Skeleton className='w-full h-1.5 rounded-lg' />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MatchHistorySkeleton;