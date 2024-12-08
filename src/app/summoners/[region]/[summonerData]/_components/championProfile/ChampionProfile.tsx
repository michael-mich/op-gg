import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import useChampionDataQuery from '@/app/_hooks/queries/useChampionDataQuery';
import Image from 'next/image';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type {
  TUpdatedLiveGameParticipants,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';
import Runes from './Runes';
import Spells from './Spells';

export type TSummoner = TUpdatedLiveGameParticipants | TSummonerDetailedMatchHistory | undefined;

export type TSummonerAndImageStyle = {
  summonerMatchHistory: TSummonerDetailedMatchHistory | undefined;
  summonerLiveGame: TUpdatedLiveGameParticipants | undefined;
  imageSizeStyle: string;
}

type Props = {
  summoner: TSummoner;
  displaySummonerData?: boolean;
  imageSize?: 'default' | 'large';
  displayLevel?: boolean;
  levelSize?: 'default' | 'small';
}

const ChampionProfile = ({
  summoner,
  displaySummonerData = false,
  imageSize = 'default',
  displayLevel = false,
  levelSize = 'default',
}: Props) => {
  const { data: newestGameVersion } = useGameVersionQuery();
  const { data: championData } = useChampionDataQuery();

  const isDetailedMatchHistory = (summoner: TSummoner): summoner is TSummonerDetailedMatchHistory => {
    return (summoner as TSummonerDetailedMatchHistory | undefined)?.champLevel !== undefined;
  }
  const summonerMatchHistory = isDetailedMatchHistory(summoner) ? summoner : undefined;
  const summonerLiveGame = !isDetailedMatchHistory(summoner) ? summoner : undefined;

  const imageLargeSize = imageSize === 'large';
  const imageSizeStyle = imageLargeSize ? 'size-[22px]' : 'size-[15px]';

  return (
    <div className='flex items-center'>
      <div className='relative'>
        <Image
          className={`rounded-image ${imageLargeSize ? 'size-12 min-w-12 min-h-12' : 'size-8 min-w-8 min-h-8'}`}
          src={`${imageEndpoints.championImage(newestGameVersion)}${summonerMatchHistory?.championName}.png`}
          width={48}
          height={48}
          alt={''}
        />
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
            <span className={`${summonerMatchHistory && 'overflow-hidden text-ellipsis whitespace-nowrap'} 
            font-bold text-[#202d37] dark:text-white`}
            >
              {summonerMatchHistory?.riotIdGameName || summonerLiveGame?.summonerNameAndTagLine?.name}
            </span>
            {summonerLiveGame && (
              <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                #{summonerLiveGame?.summonerNameAndTagLine?.tagLine}
              </span>
            )}
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