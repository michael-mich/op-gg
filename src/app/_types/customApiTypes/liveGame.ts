import type {
  TLiveGameParticipants,
  TSummonerSpellContent,
  TLiveGame,
  TRune,
  TRuneSlots
} from '../apiTypes';
import type {
  TSummonerAccount,
  TChampion,
  TSummonerRank,
} from '../apiTypes';
import { RuneType } from '@/app/_enums/enums';

export interface TUpdatedRune extends Omit<TRune, 'slots'> {
  slots: Array<TRuneSlots>;
  type: RuneType;
}

export type TBannedChampion = {
  name: string;
  image: string;
  championId: number;
  teamId: number;
}

export interface TUpdatedLiveGameParticipants extends Pick<TLiveGameParticipants, 'teamId'>, Pick<TSummonerAccount, 'puuid'> {
  championData: Pick<TChampion, 'name'> & {
    image: string;
  } | undefined;
  summonerNameAndTagLine: {
    name: string | undefined;
    tagLine: string | undefined;
  } | undefined;
  summonerLevel: number | undefined;
  runes: Array<TUpdatedRune | undefined>;
  rank: TSummonerRank | undefined,
  spells: Array<TSummonerSpellContent> | undefined,
  bannedChampion: TBannedChampion | undefined;
  shardIds: Array<number> | undefined;
}

export interface TSummonerLiveGameData extends Pick<TLiveGame, 'gameLength'> {
  teams: Array<{
    teamType: 'blue' | 'red',
    teamParticipants: Array<TUpdatedLiveGameParticipants>
  }>;
}