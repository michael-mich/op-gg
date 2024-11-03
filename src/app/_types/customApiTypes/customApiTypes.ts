import type { TTeamGeneric } from '../types';
import type {
  TChampion,
  TSummonerMatchHistoryData,
  TMatchHistory,
  TSummonerSpellContent
} from '../apiTypes';
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

type TSummonerGameData = {
  items: Array<
    Record<string, {
      name: string;
    } & Pick<TChampion, 'image'>> | '0'
  >;
  kda: number;
  killParticipation: number | undefined;
  spells: Array<TSummonerSpellContent> | undefined;
  minions: {
    minionsPerMinute: number;
    totalMinions: number;
    minions: number;
    enemyJungleMinions: number;
  };
} & Omit<TSummonerMatchHistoryData, 'perks'>;

export type TDetailedMatchHistory = {
  info: Omit<TMatchHistory['info'], 'participants'> & {
    segregatedTeams: Array<TTeamGeneric<TSummonerGameData>>;
    currentSummoner: TSummonerGameData;
  };
}