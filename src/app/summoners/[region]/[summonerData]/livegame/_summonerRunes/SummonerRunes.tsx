import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getRunesData } from '@/app/_lib/api/riotGamesApi/riotGamesApi';
import type { TUpdatedLiveGameParticipants } from '@/app/_types/apiTypes/liveGameTypes';
import { shardData } from './summonerRunesData';

type Props = {
  summoner: TUpdatedLiveGameParticipants;
}

const SummonerRunes = ({ summoner }: Props) => {
  const { data: runesData } = useQuery({
    queryKey: ['runes'],
    queryFn: () => getRunesData(),
    refetchOnWindowFocus: false
  });

  const shardsWithMarkedStatus = shardData.map((shardGroup, shardGroupIndex) => shardGroup.map((shard) => {
    const markedShard = summoner.shardIds?.some((summonerShardId, summonerShardIdIndex) => {
      if (shardGroupIndex === summonerShardIdIndex) {
        return summonerShardId === shard.id;
      }
    });

    return {
      ...shard,
      markedShard
    }
  }));

  const filteredRunes = summoner.runes.flatMap((summonerRune) => runesData?.filter((rune) => {
    return summonerRune?.id === rune.id;
  }));

  const keystoneRemoveFromSecondRune = filteredRunes.map((mainRune, index) => {
    if (index === 1) {
      return {
        ...mainRune,
        slots: mainRune?.slots.slice(1)
      }
    }
    else {
      return mainRune;
    }
  });

  const runesWithMarkedStatus = keystoneRemoveFromSecondRune.map((mainRune) => ({
    ...mainRune,
    slots: mainRune?.slots?.map((slot) => ({
      ...slot,
      runes: slot.runes.map((rune) => {
        const markedRune = summoner.runes.find((summonerMainRune) => summonerMainRune?.slots.some((summonerRune) => {
          return summonerRune.id === rune.id;
        }));

        return {
          ...rune,
          markedRune
        }
      })
    }))
  }));

  return (
    <tr className='dark:bg-darkMode-darkGray'>
      <td colSpan={6}>
        <div className='flex items-center justify-center py-[10px]'>
          {runesWithMarkedStatus.map((mainRune, mainRuneIndex) => (
            <div
              className={`${mainRuneIndex === 1 && 'self-end border-r-2 border-almostWhite dark:border-r-darkMode-secondDarkGray'}`}
              key={mainRuneIndex}
            >
              <Image
                className='size-7 bg-almostWhite dark:bg-darkMode-darkBlue rounded-full aspect-square m-auto'
                src={`https:ddragon.leagueoflegends.com/cdn/img/${mainRune?.icon}`}
                width={28}
                height={28}
                alt={mainRune?.name || ''}
              />
              <div className={`${mainRuneIndex === 0 ? 'pr-2 border-r-2 border-almostWhite dark:border-r-darkMode-secondDarkGray' : 'px-2'} flex flex-col gap-2 mt-2`}>
                {mainRune?.slots?.map((slot, slotIndex) => (
                  <div
                    className={`${(mainRune.name === 'Precision' && slotIndex === 0 && mainRuneIndex === 0) ? 'gap-2' : 'gap-6'} 
                    flex items-center justify-center`}
                    key={slotIndex}
                  >
                    {slot.runes.map((rune, runeIndex) => (
                      <div key={runeIndex}>
                        <Image
                          className={`${!rune.markedRune && 'grayscale opacity-50'} 
                          size-7 bg-darkMode-darkBlue rounded-full aspect-square`}
                          src={`https:ddragon.leagueoflegends.com/cdn/img/${rune?.icon}`}
                          width={28}
                          height={28}
                          alt={rune.name}
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <span className='text-center text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray pt-2'>
                  {mainRune.name}
                </span>
              </div>
            </div>
          ))}
          <div className='self-end pl-2'>
            <div className='flex flex-col gap-3'>
              {shardsWithMarkedStatus.map((shardGroup, shardGroupIndex) => (
                <div className='flex gap-3' key={shardGroupIndex}>
                  {shardGroup.map((shard, shardIndex) => (
                    <Image
                      className={`${shard.markedShard ? 'border border-yellow' : 'grayscale opacity-50'} 
                      size-6 bg-darkMode-darkBlue rounded-full aspect-square`}
                      src={shard.image}
                      width={24}
                      height={24}
                      alt={`${shard.type} shard`}
                      key={shardIndex}
                    />
                  ))}
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