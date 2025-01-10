import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import { findChampionById } from '../../_utils/utils';
import { isDetailedMatchHistory } from '../../_utils/typeGuards';
import type {
  TDetailedLiveGameSummoner,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';
import ChampionAvatar from '@/app/_components/ChampionAvatar';
import Runes from './Runes';
import Spells from './Spells';

export type TSummonerAndImageStyle = {
  summonerMatchHistory: TSummonerDetailedMatchHistory | undefined;
  summonerLiveGame: TDetailedLiveGameSummoner | undefined;
  imageSizeStyle: string;
}

type Props = {
  summoner: TDetailedLiveGameSummoner | TSummonerDetailedMatchHistory | undefined;
  displaySummonerData?: boolean;
  imageSize?: 'large' | 'medium';
  displayLevel?: boolean;
  levelSize?: 'default' | 'small';
}

const ChampionProfile = ({
  summoner,
  displaySummonerData = false,
  imageSize = 'medium',
  displayLevel = false,
  levelSize = 'default',
}: Props) => {
  const { data: championData } = useChampionDataQuery();
  const foundChampion = findChampionById(championData, summoner?.championId);

  const summonerMatchHistory = isDetailedMatchHistory(summoner) ? summoner : undefined;
  const summonerLiveGame = !isDetailedMatchHistory(summoner) ? summoner : undefined;

  const [summonerLiveGameName, summonerLiveGameTagLine] = summonerLiveGame?.riotId.split('#') || [];

  const imageLargeSize = imageSize === 'large';
  const imageSizeStyle = imageLargeSize ? 'size-[22px]' : 'size-[15px]';

  return (
    <div className='flex items-center'>
      <div className='relative'>
        <ChampionAvatar championData={foundChampion} imageSize={imageSize} isRoundedImage />
        {displayLevel && (
          <span className={`level ${levelSize === 'default' ? 'bottom-0 right-0 size-5 text-xss' : 'bottom-[-3px] left-[-3px] size-[15px] text-[10px]'} 
          absolute z-[1] flex items-center justify-center size-5 aspect-square`}
          >
            {summonerMatchHistory?.champLevel}
          </span>
        )}
      </div>
      <div className='flex items-center gap-0.5 ml-1'>
        <Spells
          summonerMatchHistory={summonerMatchHistory}
          summonerLiveGame={summonerLiveGame}
          imageSizeStyle={imageSizeStyle}
        />
        <Runes
          summonerMatchHistory={summonerMatchHistory}
          summonerLiveGame={summonerLiveGame}
          imageSizeStyle={imageSizeStyle}
        />
      </div>
      {displaySummonerData && (
        <div className={`${summonerMatchHistory ? 'w-[90px] ml-1.5' : 'ml-3'} flex flex-col gap-[0.1rem]`}>
          <div className={`${summonerMatchHistory && 'overflow-hidden'} flex items-baseline gap-0.5 text-xs hover:underline`}>
            <div className={`${summonerMatchHistory && 'overflow-hidden text-ellipsis whitespace-nowrap'}`}>
              <span className='font-bold text-[#202d37] dark:text-white'>
                {summonerMatchHistory?.riotIdGameName || summonerLiveGameName}
              </span>
              {summonerLiveGame && (
                <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                  #{summonerLiveGameTagLine}
                </span>
              )}
            </div>
          </div>
          <span className='text-xss text-secondGray dark:text-[#7b7a8e]'>
            Level {summonerMatchHistory?.summonerLevel || summonerLiveGame?.summonerLevel}
          </span>
        </div>
      )}
    </div>
  );
}

export default ChampionProfile;