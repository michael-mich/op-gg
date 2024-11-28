import { QueueId } from '@/app/_enums/match';

export const checkQueueType = (queueId: number | undefined): string => {
  switch (queueId) {
    case QueueId.Normal: return 'Normal';
    case QueueId.RankedSoloDuo: return 'Ranked Solo/Duo';
    case QueueId.NormalBlindPick: return 'Normal Blind Pick';
    case QueueId.RankedFlex: return 'Ranked Flex';
    case QueueId.ARAM: return 'ARAM';
    case QueueId.Clash: return 'Clash';
    case QueueId.URF || QueueId.URF2: return 'URF';
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