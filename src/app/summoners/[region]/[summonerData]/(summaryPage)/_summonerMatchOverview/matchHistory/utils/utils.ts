import { TSummonerDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import { QueueId } from '@/app/_enums/match';

export const getFormattedKda = (summoner: TSummonerDetailedMatchHistory | undefined): string => {
  if (summoner?.kills !== 0 && summoner?.deaths === 0 && summoner?.assists !== 0) {
    return 'Perfect';
  }
  else {
    return `${summoner?.kda?.toFixed(2)}:1`;
  }
}

export const determineTeamsOrder = <T>(
  currentSummoner: TSummonerDetailedMatchHistory | undefined,
  teams: Array<T> | undefined
): Array<T | undefined> | undefined => {
  if (currentSummoner?.teamId === 100) {
    return teams;
  }
  else {
    const blueTeam = teams?.[0];
    const redTeam = teams?.[1];
    return [redTeam, blueTeam];
  }
}

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