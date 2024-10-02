import { memo } from 'react';
import Image from 'next/image';
import { calculateWinRate, getRankedEmblem, formatTierName } from '@/app/_lib/utils/rank';
import type { TUpdatedLiveGameParticipants } from '@/app/_types/apiTypes';

type Props = {
  summoner: TUpdatedLiveGameParticipants;
}

const SummonerRank = ({ summoner }: Props) => {
  const totalPlayedGames = summoner.rank ? summoner.rank?.losses + summoner.rank?.wins : 0;
  const winRatio = calculateWinRate(summoner.rank);

  const getColorBasedOnWinRatio = (winRatio: number, useageType: 'bg' | 'text'): string => {
    if (winRatio >= 70) {
      return `${useageType}-orange`;
    }
    else if (winRatio >= 60) {
      return `${useageType}-secondLightBlue`;
    }
    else if (winRatio >= 50) {
      return `${useageType}-mediumGreen`;
    }
    else {
      return `${useageType}-lightMode-secondLighterGray dark:${useageType}-darkMode-lighterGray`
    };
  }

  return (
    <>
      <td className='text-xss py-2 pl-3 pr-0'>
        {isNaN(winRatio) ? (
          ''
        ) : (
          <Image
            className='m-auto'
            src={getRankedEmblem(summoner.rank) || ''}
            width={15}
            height={15}
            alt={summoner.rank?.rank || ''}
          />
        )}
      </td>
      <td className='text-xss text-lightMode-secondLighterGray dark:text-darkMode-lighterGray text-center py-2 pr-3 pl-0'>
        {isNaN(winRatio) ? (
          <span>Level {summoner.summonerLevel}</span>
        ) : (
          <>
            {formatTierName(summoner.rank)} {summoner.rank?.rank} ({summoner.rank?.leaguePoints}LP)
          </>
        )}
      </td>
      <td className={`${isNaN(winRatio) && 'text-center'} text-xss py-2 px-3`}>
        {isNaN(winRatio) ? (
          <span className='text-center'>-</span>
        ) : (
          <>
            <div className='text-center'>
              <span className={`${getColorBasedOnWinRatio(winRatio, 'text')} font-bold mr-0.5`}>
                {winRatio}%
              </span>
              <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                ({totalPlayedGames} Played)
              </span>
            </div>
            <div className='relative w-[100px] h-[6px] bg-lightMode-thirdLighterGray dark:bg-lightGrayBackground mt-1'>
              <div
                className={`absolute left-0 z-10 h-full 
                ${winRatio >= 70 ? 'bg-orange' : winRatio >= 60 ? 'bg-secondLightBlue' : winRatio >= 50 ? 'bg-mediumGreen' : 'bg-lightMode-secondLighterGray dark:bg-darkMode-lighterGray'}`}
                style={{ width: `${winRatio}%` }}
              ></div>
            </div>
          </>
        )}
      </td>
    </>
  );
}

export default memo(SummonerRank);