import Image from 'next/image';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import { handleKdaTextColor } from '@/app/_utils/utils';
import type { TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  matchHistorySummaryData: TMatchHistorySummary | undefined;
}

const TopChampions = ({ matchHistorySummaryData }: Props) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  return (
    <div>
      <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        Recent {matchHistorySummaryData?.gameAmounts.totalGames} Games Played Champions
      </div>
      <div className='flex flex-col gap-2 mt-3'>
        {matchHistorySummaryData?.topPlayedChampions.map((championData, championIndex) => (
          <div className='flex items-center' key={championData.championDetails.name || championIndex}>
            <Image
              className='rounded-image mr-2'
              src={`${imageEndpoints.championImage(newestGameVersion)}${championData.championDetails.image?.full}`}
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