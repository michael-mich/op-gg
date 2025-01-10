import { QueueId } from '@/app/_enums/match';
import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

export const findChampionById = (
  championData: Array<TChampion> | undefined,
  championId: number | string | undefined
) => {
  return championData?.find((champion) => {
    if (typeof championId === 'string') {
      return champion.key === championId;
    }
    else {
      return champion.key === championId?.toString();
    }
  });
}

export const handleKdaTextColor = (kda: number | undefined): string => {
  const basicGray = 'text-lightMode-secondMediumGray dark:text-darkMode-lighterGray';
  if (kda) {
    if (kda >= 6.0) {
      return 'text-orange';
    }
    else if (kda >= 4.0) {
      return 'text-secondLightBlue';
    }
    else if (kda >= 3.0) {
      return 'text-mediumGreen';
    }
    else {
      return basicGray;
    }
  }
  else {
    return basicGray;
  }
}

export const checkQueueType = (queueId: number | undefined): string => {
  switch (queueId) {
    case QueueId.Normal:
    case QueueId.Normal2:
      return 'Normal';
    case QueueId.RankedSoloDuo: return 'Ranked Solo/Duo';
    case QueueId.NormalBlindPick: return 'Normal Blind Pick';
    case QueueId.RankedFlex: return 'Ranked Flex';
    case QueueId.ARAM: return 'ARAM';
    case QueueId.Clash: return 'Clash';
    case QueueId.URF:
    case QueueId.URF2:
      return 'URF';
    case QueueId.SnowARURF: return 'Snow ARURF';
    case QueueId.NexusBlitz: return 'Nexus Blitz';
    case QueueId.Blitz: return 'Blitz';
    case QueueId.UltimateSpellbook: return 'Ultimate Spellbook';
    case QueueId.Tutorial1: return 'Tutorial 1';
    case QueueId.Tutorial2: return 'Tutorial 2';
    case QueueId.Tutorial3: return 'Tutorial 3';
    case QueueId.ARAMClash: return 'ARAM Clash';
    default: return 'Unknown Queue Type';
  }
}