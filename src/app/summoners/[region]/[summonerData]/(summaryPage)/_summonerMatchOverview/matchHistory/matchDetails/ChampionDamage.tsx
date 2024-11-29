import { calculatePercentage } from '@/app/_utils/matchStats';
import type { TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  summoner: TSummonerDetailedMatchHistory | undefined;
}

const ChampionDamage = ({ summoner }: Props) => {
  const calculateDamagePercentage = (
    summoner: TSummonerDetailedMatchHistory | undefined,
    calcualteDamageDealt = true
  ): number | undefined => {
    if (summoner) {
      const maxDamageDealt = 43_000;
      const maxDamageTaken = 60_000;

      const maxDamage = calcualteDamageDealt ? maxDamageDealt : maxDamageTaken;
      const damage = calcualteDamageDealt ? summoner?.totalDamageDealtToChampions : summoner?.totalDamageTaken;

      return damage > maxDamage ? 100 : calculatePercentage(damage, maxDamage);
    }
  }

  return (
    <td className='text-xss text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
      <div className='grid grid-cols-2 gap-2'>
        <div className='text-center'>
          <span>{summoner?.totalDamageDealtToChampions.toLocaleString('en')}</span>
          <div className='relative w-full h-1.5 bg-white dark:bg-darkMode-mediumGray mt-1'>
            <div
              className={`absolute top-0 left-0 z-[1] bg-red h-1.5`}
              style={{ width: `${calculateDamagePercentage(summoner)}%` }}
            ></div>
          </div>
        </div>
        <div className='text-center'>
          <span>{summoner?.totalDamageTaken.toLocaleString('en')}</span>
          <div className='relative w-full h-1.5 bg-white dark:bg-darkMode-mediumGray mt-1'>
            <div
              className='absolute top-0 left-0 z-[1] h-1.5 bg-darkMode-secondMediumGray'
              style={{ width: `${calculateDamagePercentage(summoner, false)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </td>
  );
}

export default ChampionDamage;