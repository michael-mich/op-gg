import type { TSummonerRank } from '@/app/_types/apiTypes/apiTypes';

const rankedEmblems = [
  '/ranked-emblems/Bronze.png',
  '/ranked-emblems/Challenger.png',
  '/ranked-emblems/Diamond.png',
  '/ranked-emblems/Emerald.png',
  '/ranked-emblems/Gold.png',
  '/ranked-emblems/Grandmaster.png',
  '/ranked-emblems/Iron.png',
  '/ranked-emblems/Master.png',
  '/ranked-emblems/Platinum.png',
  '/ranked-emblems/Silver.png'
];

export const calculateWinRate = (rankedData: TSummonerRank | undefined): number => {
  const wins = rankedData?.wins || 0;
  const losses = rankedData?.losses || 0;
  const winRate = (wins / (wins + losses) * 100);

  return Math.round(winRate);
}

export const formatTierName = (rankedData: TSummonerRank | undefined): string => {
  if (rankedData) {
    const tierName = rankedData.tier;
    return `${tierName[0]}${tierName.slice(1).toLowerCase()}`;
  }
  else {
    return '';
  }
}

export const getRankedEmblem = (rankedData: TSummonerRank | undefined): string | undefined => {
  return rankedEmblems.find((emblem) => {
    const tierName = emblem.replaceAll('/', ' ').replace('.', ' ').split(' ')[2];
    return tierName === formatTierName(rankedData);
  });
}