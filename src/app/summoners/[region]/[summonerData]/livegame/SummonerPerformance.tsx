import { memo } from 'react';
import Image from 'next/image';
import { calculatePercentage } from '@/app/_utils/utils';
import { getRankedEmblem, formatTierName } from '@/app/_utils/rank';
import type { TDetailedLiveGameSummoner } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  summoner: TDetailedLiveGameSummoner;
}

const SummonerPerformance = ({ summoner }: Props) => {
  const totalPlayedGames = summoner.rank ? summoner.rank?.losses + summoner.rank?.wins : 0;
  const winRatio = calculatePercentage(summoner.rank?.wins, totalPlayedGames);

  return (
    <>
      <td className='text-xss py-2 pl-3 pr-0'>
        {winRatio > 0 && (
          <Image
            className='m-auto mr-6'
            src={getRankedEmblem(summoner.rank) || ''}
            width={15}
            height={15}
            alt={summoner.rank?.rank || ''}
          />
        )}
      </td>
      <td className='text-xss text-lightMode-secondLighterGray dark:text-darkMode-lighterGray text-center py-2 pr-3 pl-0'>
        {!winRatio ? (
          <span>Level {summoner.summonerLevel}</span>
        ) : (
          <>
            {formatTierName(summoner.rank?.tier)} {summoner.rank?.rank} ({summoner.rank?.leaguePoints}LP)
          </>
        )}
      </td>
      <td className={`${!winRatio && 'text-center'} text-xss py-2 px-3`}>
        {!winRatio ? (
          <span className='text-center text-[#c2c9ce] dark:text-[#60606f]'>-</span>
        ) : (
          <>
            <div className='text-center'>
              <span className={`${winRatio >= 70 ? 'text-orange' : winRatio >= 60 ? 'text-secondLightBlue' : winRatio >= 50 ? 'text-mediumGreen' : 'text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'} 
              font-bold mr-0.5`}>
                {winRatio}%
              </span>
              <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                ({totalPlayedGames} Played)
              </span>
            </div>
            <div className='relative w-[100px] h-[6px] bg-lightMode-thirdLighterGray dark:bg-lightGrayBackground mt-1'>
              <div
                className={`${winRatio >= 70 ? 'bg-orange' : winRatio >= 60 ? 'bg-secondLightBlue' : winRatio >= 50 ? 'bg-mediumGreen' : 'bg-lightMode-secondLighterGray dark:bg-darkMode-lighterGray'} 
                absolute left-0 z-10 h-full`}
                style={{ width: `${winRatio}%` }}
              ></div>
            </div>
          </>
        )}
      </td >
    </>
  );
}

export default memo(SummonerPerformance);