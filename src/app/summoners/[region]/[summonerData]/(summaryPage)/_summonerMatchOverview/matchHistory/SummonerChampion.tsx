import type { TDetailedMatchHistory } from '@/app/_types/serverActions/serverActions';
import { Avatar } from '@nextui-org/react';

type Props = {
  match: TDetailedMatchHistory;
}

const SummonerChampion = ({ match }: Props) => {
  const { championName, champLevel } = match.currentSummonerMatchData || {};

  return (
    <div>
      <div className='relative'>
        <Avatar
          src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/champion/${championName}.png`}
          size='lg'
        />
        <div className='absolute bottom-0 right-0'>
          <span className='level flex size-5 items-center justify-center text-xss rounded-full aspect-square'>
            {champLevel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SummonerChampion;