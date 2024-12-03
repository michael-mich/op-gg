import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import Image from 'next/image';
import type { TMatchAndSummonerProps } from '../MatchHistory';

const ChampionItems = ({ summoner }: TMatchAndSummonerProps) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  return (
    <div className='flex items-center justify-center gap-0.5'>
      {summoner?.items?.map((item, index) => {
        const lastItem = summoner?.items && summoner.items.length - 1 === index;

        return (
          <div
            className={`${summoner?.gameEndedInEarlySurrender ? 'bg-[#c3cbd1] dark:bg-[#515163]' : summoner?.win ? 'bg-[#b3cdff] dark:bg-[#2f436e]' : 'bg-[#ffbac3] dark:bg-[#703c47]'} 
            size-[22px] ${lastItem ? 'rounded-full' : 'rounded'}`}
            key={index}
          >
            {item !== null && (
              <Image
                className={`${lastItem ? 'rounded-full' : 'rounded'}`}
                src={`${imageEndpoints.championItem(newestGameVersion)}${item.image.full}`}
                width={32}
                height={32}
                alt={item.name}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ChampionItems;