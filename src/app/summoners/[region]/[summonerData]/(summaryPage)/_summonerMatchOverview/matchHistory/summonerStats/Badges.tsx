import type { TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import type { TMatchAndSummonerProps } from '../MatchHistory';

const checkSummonerKills = (currentSummoner: TSummonerDetailedMatchHistory | undefined) => {
  if (currentSummoner) {
    if (currentSummoner.pentaKills > 0) {
      return 'Penta';
    } else if (currentSummoner.quadraKills > 0) {
      return 'Quadra';
    } else if (currentSummoner.tripleKills > 0) {
      return 'Triple';
    } else if (currentSummoner.doubleKills > 0) {
      return 'Double';
    }
  }
}

const Badges = ({ currentSummoner }: TMatchAndSummonerProps) => {
  const badgeData = [
    { value: `${checkSummonerKills(currentSummoner) ? `${checkSummonerKills(currentSummoner)} Kill` : ''}` },
    { label: 'Wards Placed:', value: currentSummoner?.wardsPlaced },
    { label: 'Turret Kills:', value: currentSummoner?.turretKills },
    { label: 'Killing Sprees', value: currentSummoner?.killingSprees }
  ];

  const filteredBadges = badgeData.filter((badge) => Boolean(badge.value));

  return (
    filteredBadges && (
      <div className='flex items-center gap-0.5 max-w-[200px] overflow-x-scroll scrollbar-width-thin'>
        {filteredBadges.map((badge, index) => (
          <span
            className={`${typeof badge.value === 'string' ? 'bg-red' : 'bg-lightMode-secondMediumGray'}
            text-xs text-white whitespace-nowrap rounded-xl py-0.5 px-2`}
            key={index}
          >
            {badge?.label} {badge.value}
          </span>
        ))}
      </div>
    )
  );
}

export default Badges;