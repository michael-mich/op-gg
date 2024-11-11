import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import Image from 'next/image';
import type { TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';

interface Props extends Pick<TSummonerDetailedMatchHistory, 'win' | 'items'> {
  earlySurrender: boolean;
}

const ChampionItems = ({ items, win, earlySurrender }: Props) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  return (
    <div className='flex items-center gap-0.5'>
      {items.map((item, index) => {
        const lastItem = items.length - 1 === index;

        return (
          <div
            className={`${earlySurrender ? 'bg-[#c3cbd1] dark:bg-[#515163]' : win ? 'bg-[#b3cdff] dark:bg-[#2f436e]' : 'bg-[#ffbac3] dark:bg-[#703c47]'} 
            size-[22px] rounded ${lastItem && 'rounded-full'}`}
            key={index}
          >
            {item !== null && (
              <Image
                className={`${lastItem && 'rounded-full'} rounded`}
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