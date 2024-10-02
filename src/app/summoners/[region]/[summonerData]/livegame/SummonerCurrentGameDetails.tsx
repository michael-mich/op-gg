import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { TUpdatedLiveGameParticipants } from '@/app/_types/apiTypes';
import { Avatar } from '@nextui-org/react';

type Props = {
  summoner: TUpdatedLiveGameParticipants;
}

const SummonerCurrentGameDetails = ({ summoner }: Props) => {
  return (
    <td className='text-xss py-2 px-3'>
      <div className='flex items-center'>
        <Avatar
          src={`https://ddragon.leagueoflegends.com/cdn/14.19.1/img/champion/${summoner.championData?.image}`}
          size='sm'
        />
        <div className='flex items-center gap-0.5 ml-1'>
          <div>
            {summoner.spells?.map((spell, index) => (
              <Image
                className='size-[15px] rounded first-of-type:mb-0.5'
                src={`https://ddragon.leagueoflegends.com/cdn/14.18.1/img/spell/${spell.image.full}`}
                width={15}
                height={15}
                alt={spell.name}
                key={index}
              />
            ))}
          </div>
          <div>
            {summoner.runes.map((rune, index) => {
              const firstElement = index === 0;

              return (
                <Image
                  className='size-[15px] first-of-type:bg-black first-of-type:rounded-full first-of-type:aspect-square first-of-type:mb-0.5'
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${firstElement ? rune?.slots[0].icon : rune?.icon}`}
                  width={15}
                  height={15}
                  alt={(firstElement ? rune?.slots[0].name : rune?.name) || ''}
                  key={index}
                />
              )
            })}
          </div>
        </div>
        <div className='flex flex-col gap-[0.1rem] ml-3'>
          <Link href='' className='flex items-baseline gap-0.5 text-xs hover:underline'>
            <span className='font-bold text-[#202d37] dark:text-white'>{summoner.summonerNameAndTagLine?.name}</span>
            <span className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>#{summoner.summonerNameAndTagLine?.tagLine}</span>
          </Link>
          <span className='text-xss text-secondGray dark:text-[#7b7a8e]'>
            Level {summoner.summonerLevel}
          </span>
        </div>
      </div>
    </td>
  );
}

export default memo(SummonerCurrentGameDetails);