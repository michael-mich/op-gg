import type { TSummonerRank } from '@/app/_types/apiTypes/apiTypes';
import type { QueueType } from '../_enums/queue';

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

export const formatTierName = (tierName: string | undefined): string => {
  return tierName ? `${tierName[0]}${tierName.slice(1).toLowerCase()}` : '';
}

export const getRankedEmblem = (rankedData: TSummonerRank | undefined): string | undefined => {
  return rankedEmblems.find((emblem) => {
    const tierName = emblem.replaceAll('/', ' ').replace('.', ' ').split(' ')[2];
    return tierName === formatTierName(rankedData?.tier);
  });
}

export const findQueueTypeData = (
  queueData: Array<TSummonerRank> | undefined,
  queueType: QueueType
): TSummonerRank | undefined => {
  return queueData?.find((data) => data.queueType === queueType);
}