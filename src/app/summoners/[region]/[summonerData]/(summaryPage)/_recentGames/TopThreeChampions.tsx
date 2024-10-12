import Image from 'next/image';
import type { TRecetGames, TPromiseResult } from '@/app/_types/apiTypes/apiTypes';

type Props = {
  recentGamesData: TPromiseResult<TRecetGames>;
}

const TopThreeChampions = ({ recentGamesData }: Props) => {
  return (
    <div>
      <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        Recent {recentGamesData?.gameAmounts.totalGames} Games Played Champions
      </span>
      <div className='flex flex-col gap-1'>
        {recentGamesData?.topPlayedChampions.map((championData) => (
          <div className='flex items-center' key={championData.championName}>
            <Image
              className='size-6 rounded-full aspect-square mr-2'
              src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${championData.championName}.png`}
              width={24}
              height={24}
              alt={championData.championName}
            />
            <span className='text-xss mr-0.5'>{championData.winRatio}%</span>
            <span className='text-xss dark:text-darkMode-secondMediumGray'>
              ({championData.wonMatches}W {championData.lostMatches}L)
            </span>
            <span className='text-xss ml-1'>{championData.kda.toFixed(2)} KDA</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopThreeChampions;