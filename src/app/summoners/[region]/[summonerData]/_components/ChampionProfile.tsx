import { memo } from 'react';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import Image from 'next/image';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type {
  TUpdatedLiveGameParticipants,
  TSummonerDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';

type TSummoner = TUpdatedLiveGameParticipants | TSummonerDetailedMatchHistory | undefined;

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

  const isDetailedMatchHistory = (summoner: TSummoner): summoner is TSummonerDetailedMatchHistory => {
    return (summoner as TSummonerDetailedMatchHistory | undefined)?.champLevel !== undefined;
  }
  const matchHistory = isDetailedMatchHistory(summoner) ? summoner : undefined;
  const liveGame = !isDetailedMatchHistory(summoner) ? summoner : undefined;

  const imageLargeSize = imageSize === 'large';
  const imageSizeStyle = imageLargeSize ? 'size-[22px]' : 'size-[15px]';

  return (
    <div className='flex items-center'>
      <div className='relative'>
        <Image
          className={`rounded-image ${imageLargeSize ? 'size-12 min-w-12 min-h-12' : 'size-8 min-w-8 min-h-8'}`}
          src={`${imageEndpoints.championImage(newestGameVersion)}${summoner?.championData?.image || `${matchHistory?.championName}.png`}`}
          width={48}
          height={48}
          alt={summoner?.championData?.name || ''}
        />
        {displayLevel && (
          <span className={`level ${levelSize === 'default' ? 'bottom-0 right-0 size-5 text-xss' : 'bottom-[-3px] left-[-3px] size-[15px] text-[10px]'} 
          absolute z-[1] flex items-center justify-center size-5 aspect-square`}
          >
            {matchHistory?.champLevel}
          </span>
        )}
      </div>
      <div className='flex items-center gap-0.5 ml-1'>
        <div>
          {summoner?.spells?.map((spell, index) => (
            <Image
              className={`${imageSizeStyle} min-w-[15px] min-h-[15px] rounded first-of-type:mb-0.5`}
              src={`${imageEndpoints.spell(newestGameVersion)}${spell.image.full}`}
              width={15}
              height={15}
              alt={spell.name}
              key={index}
            />
          ))}
        </div>
        <div>
          {summoner?.runes?.map((rune, index) => {
            const firstElement = index === 0;

            return (
              <Image
                className={`${imageSizeStyle} min-w-[15px] min-h-[15px] first-of-type:bg-black 
                first-of-type:rounded-full first-of-type:aspect-square first-of-type:mb-0.5`}
                src={`${imageEndpoints.rune}${firstElement ? rune?.slots[0].icon : rune?.icon}`}
                width={15}
                height={15}
                alt={(firstElement ? rune?.slots[0].name : rune?.name) || ''}
                key={index}
              />
            );
          })}
        </div>
      </div>
      {displaySummonerData && (
        <div className={`${matchHistory ? 'w-[90px] ml-1.5' : 'ml-3'} flex flex-col gap-[0.1rem]`}>
          <div className={`${matchHistory && 'overflow-hidden'} flex items-baseline gap-0.5 text-xs hover:underline`}>
            <span className={`${matchHistory && 'overflow-hidden text-ellipsis whitespace-nowrap'} 
            font-bold text-[#202d37] dark:text-white`}
            >
              {matchHistory?.riotIdGameName || liveGame?.summonerNameAndTagLine?.name}
            </span>
            {liveGame && (
              <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
                #{liveGame?.summonerNameAndTagLine?.tagLine}
              </span>
            )}
          </div>
          <span className='text-xss text-secondGray dark:text-[#7b7a8e]'>
            Level {matchHistory?.summonerLevel || liveGame?.summonerLevel}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(ChampionProfile);