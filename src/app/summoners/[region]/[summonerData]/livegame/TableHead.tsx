import { useEffect, useState } from 'react';
import { formatTierName } from '@/app/_utils/rank';
import type { TDetailedLiveGameSummoner, TTeamGeneric } from '@/app/_types/apiTypes/customApiTypes';

interface TTeam extends Pick<TTeamGeneric<''>, 'teamType'> {
  teamParticipants: Array<TDetailedLiveGameSummoner>;
}

type Props = {
  isBlueTeam: boolean;
  team: TTeam;
}

const TableHead = ({ isBlueTeam, team }: Props) => {
  const [averageTierName, setAverageTierName] = useState('');
  const isBlueColor = isBlueTeam ? 'text-blue' : 'text-red';

  useEffect(() => {
    const summonersWithRank = team.teamParticipants.filter((summoner) => summoner.rank);

    const totalRankValue = summonersWithRank.reduce((sum, summoner) => {
      const tierName = formatTierName(summoner.rank?.tier);
      return tierName ? sum + tierRankValues[tierName as keyof typeof tierRankValues] : sum;
    }, 0);
    const averageRankValue = Math.round(totalRankValue / summonersWithRank.length);

    const tierByRankValue = Object.fromEntries(
      Object.entries(tierRankValues).map(([tierName, value]) => [value, tierName])
    );

    setAverageTierName(tierByRankValue[averageRankValue]);
  }, []);

  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th
            className={`${index === 0 ? 'flex items-center gap-2 pl-4 pr-3' : 'text-center px-3'} text-xs border-t border-t-almostWhite dark:border-t-darkMode-darkBlue py-2
            ${index === 1 ? 'w-[30px]' : index === 2 ? 'w-[132px]' : index === 3 ? 'w-[124px]' : index === 4 ? 'w-[136px]' : index === 5 ? 'w-[56px]' : 'w-auto'}`}
            scope='col'
            key={index}
          >
            {index === 0 ? (
              <>
                <span className={`${isBlueColor} font-bold`}>{isBlueTeam ? 'Blue' : 'Red'} Team</span>
                <div className='flex items-center gap-1'>
                  <span className={`${isBlueColor} font-normal`}>Tier Average:</span>
                  <span className={`${isBlueColor} font-bold`}>{averageTierName}</span>
                </div>
              </>
            ) : (
              column
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHead;

const columns = [
  '',
  '',
  `S${new Date().getFullYear()}`,
  'Ranked Ratio',
  'Runes',
  'Ban'
];

const tierRankValues = {
  Iron: 0,
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Emerald: 4,
  Diamond: 5,
  Master: 6,
  Grandmaster: 7,
  Challenger: 8,
};