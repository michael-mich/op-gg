import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import { TEN_MINUTES } from '@/app/_constants/timeUnits';
import { createEmptyStringArray } from '@/app/_utils/utils';
import type { TChampionItem } from '@/app/_types/apiTypes/apiTypes';
import type { TMatchAndSummonerProps } from '../MatchHistory';

const ChampionItems = ({ summoner }: TMatchAndSummonerProps) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  const { data: itemsData } = useQuery({
    queryKey: ['championItems'],
    queryFn: () => fetchApi<TChampionItem>(riotGamesRoutes.championItems()),
    staleTime: Infinity,
    gcTime: TEN_MINUTES
  });

  const itemIds = createEmptyStringArray(7).map((_, index) => `${summoner?.[`item${index}`]}`);

  return (
    <div className='flex items-center justify-center gap-0.5'>
      {itemIds.map((itemId, index) => {
        const item = itemsData?.[itemId];
        const isLastItem = itemIds.length - 1 === index;

        return (
          <div
            className={`${summoner?.gameEndedInEarlySurrender ? 'bg-[#c3cbd1] dark:bg-[#515163]' : summoner?.win ? 'bg-[#b3cdff] dark:bg-[#2f436e]' : 'bg-[#ffbac3] dark:bg-[#703c47]'} 
            size-[22px] ${isLastItem ? 'rounded-full' : 'rounded'}`}
            key={index}
          >
            {itemId !== '0' && (
              <Image
                className={`${isLastItem ? 'rounded-full' : 'rounded'}`}
                src={`${imageEndpoints.championItem(newestGameVersion)}${item?.image.full}`}
                width={32}
                height={32}
                placeholder='blur'
                blurDataURL='/placeholder/question-mark.webp'
                alt={item?.name || ''}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ChampionItems;