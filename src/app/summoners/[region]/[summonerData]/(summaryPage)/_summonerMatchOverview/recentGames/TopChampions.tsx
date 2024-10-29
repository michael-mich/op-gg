import Image from 'next/image';
import { handleKdaTextColor } from '@/app/_lib/utils/utils';
import type { TRecetGames } from '@/app/_types/customApiTypes/customApiTypes';

type Props = {
  recentGamesData: TRecetGames | undefined;
}

const TopChampions = ({ recentGamesData }: Props) => {
  return (
    <div>
      <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        Recent {recentGamesData?.gameAmounts.totalGames} Games Played Champions
      </div>
      <div className='flex flex-col gap-2 mt-3'>
        {recentGamesData?.topPlayedChampions.map((championData) => (
          <div className='flex items-center' key={championData.championDetails.name}>
            <Image
              className='size-6 rounded-full aspect-square mr-2'
              src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${championData.championDetails.image?.full}`}
              width={24}
              height={24}
              alt={championData.championDetails.name || ''}
            />
            <span className={`${championData.winRatio > 50 ? 'text-red' : 'text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'} text-xss mr-0.5`}>
              {championData.winRatio}%
            </span>
            <span className='text-xss text-secondGray dark:text-darkMode-secondMediumGray'>
              ({championData.wonMatches}W {championData.lostMatches}L)
            </span>
            <span className={`text-xss ml-1 ${handleKdaTextColor(championData.kda)}`}>
              {championData.kda.toFixed(2)} KDA
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopChampions;