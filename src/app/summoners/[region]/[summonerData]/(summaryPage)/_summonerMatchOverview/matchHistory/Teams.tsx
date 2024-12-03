import { memo } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type { TMatchAndSummonerProps } from './MatchHistory';

const Teams = ({ match }: TMatchAndSummonerProps) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { data: newestGameVersion } = useGameVersionQuery();

  return (
    <div className='flex gap-2 w-[168px]'>
      {match?.info.segregatedTeams?.map((team) => (
        <div className='flex flex-col gap-0.5' key={team?.teamType}>
          {team?.teamParticipants.map((summoner, summonerIndex) => {
            const currentSummoner = summonerPuuid === summoner?.puuid;

            return (
              <div
                className='flex items-center gap-1 w-fit'
                key={`${summoner?.puuid}-${summonerIndex}`}
              >
                <Image
                  className={`${currentSummoner ? 'rounded-image' : 'rounded'} size-4`}
                  src={`${imageEndpoints.championImage(newestGameVersion)}${summoner?.championData?.image || `${summoner?.championName}.png`}`}
                  width={16}
                  height={16}
                  alt={summoner?.championData?.name || ''}
                />
                <span className={`${currentSummoner ? 'text-black dark:text-white' : 'text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'} 
                block max-w-[60px] text-xs overflow-hidden text-ellipsis whitespace-nowrap`}
                >
                  {summoner?.riotIdGameName}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default memo(Teams);