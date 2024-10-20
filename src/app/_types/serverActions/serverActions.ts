import type { TTeamGeneric } from '../types';
import type { TChampion, TSummonerMatchHistoryData, TMatchHistory } from '../services';
import type { TChampionWinLostRatio, TAverageKdaStats } from './championStats';

export type TRecetGames = {
  gameAmounts: {
    totalGames: number | undefined;
  } & TChampionWinLostRatio;
  kda: TAverageKdaStats | undefined;
  averageKillParticipation: number | undefined;
  topPlayedChampions: Array<{
    championDetails: {
      name: TChampion['name'] | undefined;
      image: TChampion['image'] | undefined
    };
    kda: number;
    playAmount: number;
  } & TChampionWinLostRatio>;
  preferredPosition: Array<{
    position: string;
    playedPercentage: number;
  }>;
  playedChampions: Array<TChampion> | undefined;
}

export interface TDetailedMatchHistory extends TMatchHistory {
  currentSummonerMatchData: TSummonerMatchHistoryData | undefined;
  segregatedTeams: Array<TTeamGeneric<TSummonerMatchHistoryData>> | undefined;
}