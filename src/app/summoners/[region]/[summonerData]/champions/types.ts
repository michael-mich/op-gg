import { TSummonerChampionStats } from '@/app/_types/apiTypes';

export interface TDetailedChampionStats extends TSummonerChampionStats {
  championName: string | undefined;
  championImage: string | undefined;
  championRank?: number;
}

type TNumericChampionStats = {
  [K in keyof TDetailedChampionStats as TDetailedChampionStats[K] extends number ? K : never]: TDetailedChampionStats[K];
}

export type TNumericStatKeyPath = keyof TNumericChampionStats | 'kda.kda' | 'minions.averageKilledMinions';