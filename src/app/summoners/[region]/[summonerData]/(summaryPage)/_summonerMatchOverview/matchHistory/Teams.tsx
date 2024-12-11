import { memo } from 'react';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { findChampionById } from '../../../_utils/utils';
import type { TMatchAndSummonerProps } from './MatchHistory';
import ChampionAvatar from '@/app/_components/ChampionAvatar';

const Teams = ({ match }: TMatchAndSummonerProps) => {
  const summonerPuuid = useAppSelector((state) => state.summonerPuuid.summonerPuuid);
  const { data: championData } = useChampionDataQuery();

  return (
    <div className='flex gap-2 w-[168px]'>
      {match?.info.participants?.map((team) => (
        <div className='flex flex-col gap-0.5' key={team?.teamType}>
          {team?.teamParticipants.map((summoner, summonerIndex) => {
            const isCurrentSummoner = summonerPuuid === summoner?.puuid;
            const foundChampion = findChampionById(championData, summoner?.championId);

            return (
              <div
                className='flex items-center gap-1 w-fit'
                key={`${summoner?.puuid}-${summonerIndex}`}
              >
                <ChampionAvatar
                  championData={foundChampion}
                  imageSize='small'
                  isRoundedImage={isCurrentSummoner}
                />
                <span className={`${isCurrentSummoner ? 'text-black dark:text-white' : 'text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'} 
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