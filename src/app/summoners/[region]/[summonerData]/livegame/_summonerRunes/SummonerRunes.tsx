import Image from 'next/image';
import useChampionRunesQuery from '@/app/_hooks/queries/useChampionRunesQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import { reorderRunesByKeystone } from '../../_utils/reorderRunesByKeystone';
import type { TDetailedLiveGameSummoner } from '@/app/_types/apiTypes/customApiTypes';
import { shardData } from './summonerRunesData';

type Props = {
  summoner: TDetailedLiveGameSummoner;
}

const SummonerRunes = ({ summoner }: Props) => {
  const { data: runesData } = useChampionRunesQuery();

  const filteredRunes = runesData?.filter((rune) =>
    rune.id === summoner.perks.perkStyle || rune.id === summoner.perks.perkSubStyle
  );

  const reorderedRunes = reorderRunesByKeystone(summoner, filteredRunes);

  return (
    <tr className='dark:bg-darkMode-darkGray'>
      <td colSpan={6}>
        <div className='flex items-center justify-center py-[10px]'>
          {reorderedRunes?.map((mainRune, mainRuneIndex) => (
            <div
              className={`${mainRuneIndex === 1 && 'self-end border-r-2 border-almostWhite dark:border-r-darkMode-secondDarkGray'}`}
              key={mainRuneIndex}
            >
              <Image
                className='size-7 bg-almostWhite dark:bg-darkMode-darkBlue rounded-full aspect-square m-auto'
                src={`${imageEndpoints.rune}${mainRune?.icon}`}
                width={28}
                height={28}
                placeholder='blur'
                blurDataURL='/placeholder/question-mark.webp'
                alt={mainRune?.name || ''}
              />
              <div className={`${mainRuneIndex === 0 ? 'pr-2 border-r-2 border-almostWhite dark:border-r-darkMode-secondDarkGray' : 'px-2'} flex flex-col gap-2 mt-2`}>
                {mainRune?.slots?.map((slot, slotIndex) => (
                  (mainRuneIndex === 1 && slotIndex === 0) ? '' : (
                    <div
                      className={`${(mainRune.name === 'Precision' && slotIndex === 0 && mainRuneIndex === 0) ? 'gap-2' : 'gap-6'} 
                      flex items-center justify-center`}
                      key={slotIndex}
                    >
                      {slot.runes.map((rune, runeIndex) => (
                        <div key={runeIndex}>
                          <Image
                            className={`${!summoner.perks.perkIds.includes(rune.id) && 'grayscale opacity-50'} 
                            size-7 bg-darkMode-darkBlue rounded-full aspect-square`}
                            src={`${imageEndpoints.rune}${rune?.icon}`}
                            width={28}
                            height={28}
                            placeholder='blur'
                            blurDataURL='/placeholder/question-mark.webp'
                            alt={rune.name}
                          />
                        </div>
                      ))}
                    </div>
                  )
                ))}
                <span className='text-center text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray pt-2'>
                  {mainRune?.name}
                </span>
              </div>
            </div>
          ))}
          <div className='self-end pl-2'>
            <div className='flex flex-col gap-3'>
              {shardData.map((shardGroup, shardGroupIndex) => (
                <div className='flex gap-3' key={shardGroupIndex}>
                  {shardGroup.map((shard, shardIndex) => {
                    const isMarkedShard = shard.id === summoner.shardIds?.[shardGroupIndex];

                    return (
                      <Image
                        className={`${isMarkedShard ? 'border border-yellow' : 'grayscale opacity-50'} 
                        size-6 bg-darkMode-darkBlue rounded-full aspect-square`}
                        src={shard.image}
                        width={24}
                        height={24}
                        placeholder='blur'
                        blurDataURL='/placeholder/question-mark.webp'
                        alt={`${shard.type} shard`}
                        key={shardIndex}
                      />
                    );
                  })}
                </div>
              ))}
              <span className='text-center text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray pt-2'>
                Shards
              </span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default SummonerRunes;