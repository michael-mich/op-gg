import type { TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';

type Props = {
  currentSummoner: TSummonerDetailedMatchHistory | undefined;
}

const checkSummonerKills = (currentSummoner: TSummonerDetailedMatchHistory | undefined) => {
  if (currentSummoner) {
    if (currentSummoner.pentaKills > 0) {
      return 'Penta';
    }
    else if (currentSummoner.quadraKills > 0) {
      return 'Quadra';
    }
    else if (currentSummoner.tripleKills > 0) {
      return 'Tripple';
    }
    else if (currentSummoner.doubleKills > 0) {
      return 'Double';
    }
  }
}

const Badges = ({ currentSummoner }: Props) => {
  const badgeData = [
    { value: `${checkSummonerKills(currentSummoner) ? `${checkSummonerKills(currentSummoner)} Kill` : ''}` },
    { label: 'Wards Placed:', value: currentSummoner?.wardsPlaced },
    { label: 'Turret Kills:', value: currentSummoner?.turretKills },
    { label: 'Killing Sprees', value: currentSummoner?.killingSprees }
  ];

  const filteredBadges = badgeData.filter((badge) => Boolean(badge.value));

  return (
    filteredBadges && (
      <div className='flex items-center gap-0.5 max-w-[200px] overflow-x-scroll'>
        {filteredBadges.map((badge, index) => (
          <span
            className={`${typeof badge.value === 'string' ? 'bg-red' : 'bg-lightMode-secondMediumGray'}
            text-xs text-white whitespace-nowrap rounded-xl py-1 px-2`}
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