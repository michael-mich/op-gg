import { memo } from 'react';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import Image from 'next/image';
import type {
  TUpdatedLiveGameParticipants,
  TSummonerDetailedMatchHistory
} from '../../../../_types/apiTypes/customApiTypes';

type Props = {
  summoner: TUpdatedLiveGameParticipants | TSummonerDetailedMatchHistory | undefined;
  displaySummonerData?: boolean;
  size?: 'default' | 'large';
}

const ChampionProfile = ({ summoner, displaySummonerData = false, size = 'default' }: Props) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  const summonerLiveGame = (summoner as TUpdatedLiveGameParticipants | undefined)?.summonerNameAndTagLine;
  const summonerMatchHistory = (summoner as TSummonerDetailedMatchHistory | undefined)?.championName;

  const largeSize = size === 'large';
  const imageSize = largeSize ? 'size-[22px]' : 'size-[15px]';

  return (
    <div className='flex items-center'>
      <Image
        className={`rounded-image ${largeSize ? 'size-12' : 'size-8'}`}
        src={`${imageEndpoints.championImage(newestGameVersion)}${summoner?.championData?.image || `${summonerMatchHistory}.png`}`}
        width={48}
        height={48}
        alt={summoner?.championData?.name || ''}
      />
      <div className='flex items-center gap-0.5 ml-1'>
        <div>
          {summoner?.spells?.map((spell, index) => (
            <Image
              className={`${imageSize} rounded first-of-type:mb-0.5`}
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
                className={`${imageSize} first-of-type:bg-black first-of-type:rounded-full first-of-type:aspect-square first-of-type:mb-0.5`}
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
        <div className='flex flex-col gap-[0.1rem] ml-3'>
          <div className='flex items-baseline gap-0.5 text-xs hover:underline'>
            <span className='font-bold text-[#202d37] dark:text-white'>{
              summonerLiveGame?.name}
            </span>
            <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
              #{summonerLiveGame?.tagLine}
            </span>
          </div>
          <span className='text-xss text-secondGray dark:text-[#7b7a8e]'>
            Level {summoner?.summonerLevel}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(ChampionProfile);