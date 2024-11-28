import { memo } from 'react';
import { getFormattedKda } from '../utils/utils';
import ChampionProfile from '../../../../_components/ChampionProfile';
import ChampionItems from '../components/ChampionItems';
import Badges from './Badges';
import type { TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  currentSummoner: TSummonerDetailedMatchHistory | undefined;
}

const SummonerStats = ({ currentSummoner }: Props) => {
  const formattedKda = getFormattedKda(currentSummoner);

  return (
    <div className='flex-1 self-center'>
      <div className='flex'>
        <ChampionProfile summoner={currentSummoner} imageSize='large' displayLevel />
        <div className='flex flex-col w-[108px] ml-3'>
          <div className='text-[15px] font-bold dark:text-darkMode-secondMediumGray'>
            <span className='text-lightMode-black dark:text-white'>{currentSummoner?.kills}</span> / <span className='text-red'>{currentSummoner?.deaths}</span> / <span className='text-lightMode-black dark:text-white'>{currentSummoner?.assists}</span>
          </div>
          <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray text-xs'>
            {formattedKda === 'Perfect' ? formattedKda : `${formattedKda} KDA`}
          </span>
        </div>
        <ul className={`${currentSummoner?.gameEndedInEarlySurrender ? 'border-l-lightMode-thirdLighterGray dark:border-l-lightGrayBackground' : currentSummoner?.win ? 'border-l-lightMode-blue dark:border-l-darkMode-mediumBlue' : 'border-l-lightMode-red dark:border-l-darkMode-red'} 
        flex flex-col gap-1 h-[58px] text-xss text-lightMode-secondLighterGray dark:text-darkMode-lighterGray border-l pl-2`}
        >
          <li className='text-xs leading-3 text-red'>
            P/Kill {currentSummoner?.killParticipation || 0}%
          </li>
          <li>
            CS {currentSummoner?.minions?.totalMinions} ({currentSummoner?.minions?.minionsPerMinute})
          </li>
          <li>{currentSummoner?.rank?.tier}</li>
        </ul>
      </div>
      <div className='flex items-center gap-2 mt-[2px]'>
        <ChampionItems
          items={currentSummoner?.items}
          win={currentSummoner?.win}
          earlySurrender={currentSummoner?.gameEndedInEarlySurrender}
        />
        <Badges currentSummoner={currentSummoner} />
      </div>
    </div>
  );
}

export default memo(SummonerStats);