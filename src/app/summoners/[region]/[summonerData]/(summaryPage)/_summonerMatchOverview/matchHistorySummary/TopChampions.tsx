import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import { handleKdaTextColor, findChampionById } from '../../../_utils/utils';
import type { TMatchHistorySummary } from '@/app/_types/apiTypes/customApiTypes';
import ChampionAvatar from '@/app/_components/ChampionAvatar';

type Props = {
  matchHistorySummaryData: TMatchHistorySummary | undefined;
}

const TopChampions = ({ matchHistorySummaryData }: Props) => {
  const { data: championData } = useChampionDataQuery();

  return (
    <div>
      <div className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
        Recent {matchHistorySummaryData?.gameAmounts.totalGames} Games Played Champions
      </div>
      <div className='flex flex-col gap-2 mt-3'>
        {matchHistorySummaryData?.topPlayedChampions.map((champion, championIndex) => {
          const foundChampion = findChampionById(championData, champion.championId)

          return (
            <div className='flex items-center' key={championIndex}>
              <ChampionAvatar
                championData={foundChampion}
                imageSize='smallMedium'
                isRoundedImage
              />
              <span className={`${champion.winRatio > 50 ? 'text-red' : 'text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'} text-xss mr-0.5`}>
                {champion.winRatio}%
              </span>
              <span className='text-xss text-secondGray dark:text-darkMode-secondMediumGray'>
                ({champion.wonMatches}W {champion.lostMatches}L)
              </span>
              <span className={`text-xss ml-1 ${handleKdaTextColor(champion.kda)}`}>
                {champion.kda.toFixed(2)} KDA
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopChampions;