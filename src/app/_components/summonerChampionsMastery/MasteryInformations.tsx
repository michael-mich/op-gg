import Image from 'next/image';
import type { TChampionMastery, TChampion } from '@/app/_types/apiTypes';
import { Progress } from '@nextui-org/react';

type Props = {
  championData: TChampion | undefined;
  championMastery: TChampionMastery;
  getTopChampions: boolean;
}

const MasteryInformations = ({ championData, championMastery, getTopChampions = true }: Props) => {
  const championLastPlayTimeDate = new Date(championMastery.lastPlayTime);
  const lastPlayTimeDay = championLastPlayTimeDate.getDate().toString().padStart(2, '0');
  const lastPlayTimeMonth = (championLastPlayTimeDate.getMonth() + 1).toString().padStart(2, '0');
  const lastPlayTimeYear = championLastPlayTimeDate.getFullYear();

  const gradeCountPairs = Object.entries(championMastery.nextSeasonMilestone.requireGradeCounts);

  const calculateTotalPointsForNextLevel = (): number => {
    if (championMastery.championPointsUntilNextLevel < 0) {
      const convertToPositiveNumber = Math.abs(championMastery.championPointsUntilNextLevel);
      return championMastery.championPointsSinceLastLevel - convertToPositiveNumber;
    }
    else {
      return championMastery.championPointsSinceLastLevel + championMastery.championPointsUntilNextLevel;
    }
  }

  return (
    <div className={`${getTopChampions ? 'group-first-of-type:left-0 group-first-of-type:translate-x-0' : 'left-1/2 -translate-x-1/2'} 
    opacity-0 invisible pointer-events-none absolute -top-[9.2rem] z-10 w-[230px] bg-black py-2 px-2.5 transition-all group-hover:opacity-100 group-hover:visible`}
    >
      <div className='border-b border-b-darkSlateGray pb-2'>
        <div className='flex items-center gap-2'>
          <div className='flex flex-col items-center w-fit'>
            <Image
              className='w-10 h-auto'
              src='https://s-lol-web.op.gg/static/images/mastery/mastery-10.png?v=1721451321478'
              width={40}
              height={31}
              alt={championData?.name || ''}
            />
            <span className='level w-fit text-[11px] py-0 mt-[-6px]'>
              {championMastery.championLevel}
            </span>
          </div>
          <span className='text-[11px] font-bold text-white'>
            {championData?.name}
          </span>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-[11px] text-white'>
            {gradeCountPairs.map(([grade, count]) => {
              const gradesArray = Array(count).fill(grade);

              return (
                gradesArray.map((gradeItem, index) => (
                  <span
                    className='text-[11px] text-[#9AA4AF] border-t border-t-darkSlateGray border-b border-b-darkSlateGray 
                    border-l border-l-darkSlateGray last-of-type:border-r last-of-type:border-darkSlateGray p-0.5'
                    key={index}
                  >
                    {gradeItem}
                  </span>
                ))
              )
            })}
          </div>
          <span className='text-[11px] text-[#9AA4AF]'>
            Milestone {championMastery.championSeasonMilestone}
          </span>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-1'>
            <Image
              className='size-3.5'
              src='/icons/points.png'
              width={14}
              height={14}
              alt=''
              aria-hidden='true'
            />
            <span className='text-[11px] text-white'>
              {championMastery.championPointsSinceLastLevel.toLocaleString()}
            </span>
            <Progress
              maxValue={calculateTotalPointsForNextLevel()}
              value={championMastery.championPointsSinceLastLevel}
              className='mx-1'
              aria-label='progress'
            />
            <span className='text-[11px] text-white'>/</span>
            <span className='text-[11px] text-white'>
              {calculateTotalPointsForNextLevel().toLocaleString()}
            </span>
            <span className='text-[11px] text-white'>Point</span>
          </div>
          <span className='text-[11px] text-secondGray'>
            Recently Played: {lastPlayTimeDay}.{lastPlayTimeMonth}.{lastPlayTimeYear}
          </span>
        </div>
      </div>
      <div className={`${getTopChampions ? 'group-first-of-type:left-[11%] group-first-of-type:translate-x-0 left-1/2 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'} absolute top-[99.5%] 
      z-10 size-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-black`}></div>
    </div>
  );
}

export default MasteryInformations;