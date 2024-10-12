import type {
  TSummonerAccount,
  TChampion,
  TChampionMastery,
  TSummonerRank,
  TSummonerProfile
} from './apiTypes';
import { RuneType } from '@/app/_enums/enums';

export interface TLiveGameParticipants extends Pick<TSummonerAccount, 'puuid'>, Pick<TChampionMastery, 'championId'>, Pick<TSummonerProfile, 'profileIconId'> {
  spell1Id: number;
  spell2Id: number;
  perks: {
    perkIds: Array<number>;
    perkStyle: number;
    perkSubStyle: number;
  };
  summonerId: string;
  teamId: number;
}

export type TLiveGame = {
  gameMode: string;
  gameLength: number;
  participants: Array<TLiveGameParticipants>;
  bannedChampions: Array<Pick<TLiveGameParticipants, 'teamId' | 'championId'>>;
}

export interface TSummonerSpellContent extends TChampion {
  description: string;
}

export type TSummonerSpell = {
  data: Record<string, TSummonerSpellContent>
}

interface TRuneSlots extends Pick<TChampion, 'name'> {
  id: number;
  icon: string
  key: string;
  longDesc: string;
  shortDesc: string;
}

export interface TRune extends Omit<TRuneSlots, 'longDesc' | 'shortDesc'> {
  slots: Array<{
    runes: Array<TRuneSlots>;
  }>;
};

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

export type TTeam = {
  teamType: 'blue' | 'red',
  teamParticipants: Array<TUpdatedLiveGameParticipants>
}

export interface TSummonerLiveGameData extends Pick<TLiveGame, 'gameLength'> {
  teams: Array<TTeam>;
}