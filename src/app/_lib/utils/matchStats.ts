import type {
  TSummonerMatchHistoryData,
  TSummonerSpellId,
  TSpellId,
  TSummonerSpellContent,
} from '@/app/_types/apiTypes';
import type { TTeamGeneric } from '@/app/_types/types';
import type { TAverageKdaStats, TChampionWinLostRatio } from '@/app/_types/customApiTypes/championStats';
import { Spell, RuneType } from '@/app/_enums/enums';

type TSummonerData = Array<Pick<TSummonerMatchHistoryData, 'assists' | 'deaths' | 'kills'>>;

type SpellKeys<T> = T extends TSummonerSpellId ? keyof TSummonerSpellId : keyof TSpellId;

export const calculatePercentage = (part: number, total: number): number => {
  return Math.round((part / total) * 100);
}

export const calculateWinLossStats = (matchData: Array<{ win: boolean }> | undefined): TChampionWinLostRatio => {
  let wonMatches = 0;
  let lostMatches = 0;

  matchData?.forEach((data) => {
    if (data.win) {
      wonMatches++;
    }
    else {
      lostMatches++;
    }
  });

  const winRatio = matchData ? calculatePercentage(wonMatches, matchData.length) : 0;

  return {
    winRatio,
    wonMatches,
    lostMatches
  };
}

export const filterSummonerSpells = <T extends Record<SpellKeys<T>, number>>(
  spellKey1: Spell.Spell1Id | Spell.Summoner1Id,
  spellKey2: Spell.Spell2Id | Spell.Summoner2Id,
  summonerData: Array<T> | undefined,
  spellData: Array<TSummonerSpellContent> | undefined,
): Array<Array<TSummonerSpellContent> | undefined> | undefined => {

  return summonerData?.map((summoner) => spellData?.filter((spell) => {
    const spellKeyNumber = parseInt(spell.key);
    return spellKeyNumber === summoner[spellKey1] || spellKeyNumber === summoner[spellKey2];
  }));
}

export const calculateKda = (deaths: number, assists: number, kills: number): number => {
  return deaths === 0 ? assists + kills : (assists + kills) / deaths;
}

export const calculateAverageKdaStats = (summonerData: TSummonerData): TAverageKdaStats => {
  const { assists: totalAssists, deaths: totalDeaths, kills: totalKills } = summonerData.reduce(
    (accumulator, { assists, deaths, kills }) => {
      return {
        assists: accumulator.assists + assists,
        deaths: accumulator.deaths + deaths,
        kills: accumulator.kills + kills,
      }
    }, { assists: 0, deaths: 0, kills: 0 }
  );

  return {
    kda: calculateKda(totalDeaths, totalAssists, totalKills),
    averageKills: (totalKills / summonerData.length).toFixed(1),
    averageAssists: (totalAssists / summonerData.length).toFixed(1),
    averageDeaths: (totalDeaths / summonerData.length).toFixed(1)
  }
}

export const segregateSummonersToTeams = <T extends { teamId: number }>(
  matchParticipants: Array<T> | undefined
) => {
  const teams: Array<TTeamGeneric<T>> = [
    { teamType: 'blue', teamParticipants: [] },
    { teamType: 'red', teamParticipants: [] }
  ];

  for (const summoner of matchParticipants || []) {
    if (summoner.teamId === 100) {
      teams[0].teamParticipants.push(summoner);
    }
    else {
      teams[1].teamParticipants.push(summoner);
    }
  }

  return teams;
}

export const sortSummonerRunesByType = <T extends Array<{ type: RuneType } | undefined> | undefined>(
  runesData: T
) => {
  if (runesData) {
    if (runesData[0]?.type === RuneType.MainRune) {
      return runesData;
    }
    else {
      return [runesData[1], runesData[0]];
    }
  }
};