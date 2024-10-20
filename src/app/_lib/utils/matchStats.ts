import type {
  TSummonerMatchHistoryData,
  TMatchHistory,
  TSummonerSpellContent,
  TSummonerSpellsAndPerks
} from '@/app/_types/services';
import type { TTeamGeneric } from '@/app/_types/types';
import type { TAverageKdaStats, TChampionWinLostRatio } from '@/app/_types/serverActions/championStats';

type TSummonerData = Array<Pick<TSummonerMatchHistoryData, 'assists' | 'deaths' | 'kills'>>;

export const filterSummonerSpells = <T extends TSummonerSpellsAndPerks>(
  spellData: Array<TSummonerSpellContent> | undefined,
  summonerData: T
) => {
  return spellData?.filter((spell) =>
    spell.key === summonerData.spell1Id.toString() || spell.key === summonerData.spell2Id.toString()
  );
};

export const findCurrentSummonerData = (
  matchHistoryData: Array<TMatchHistory> | undefined,
  summonerPuuid: string | undefined
) => {
  return matchHistoryData?.flatMap((match) =>
    match!.info.participants.filter((participant) => (participant.puuid === summonerPuuid))
  );
};

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

export const calculateKdaStats = (summonerData: TSummonerData): TAverageKdaStats => {
  const { assists: totalAssists, deaths: totalDeaths, kills: totalKills } = summonerData.reduce(
    (accumulator, { assists, deaths, kills }) => {
      return {
        assists: accumulator.assists + assists,
        deaths: accumulator.deaths + deaths,
        kills: accumulator.kills + kills,
      }
    }, { assists: 0, deaths: 0, kills: 0 }
  );

  const kda = totalDeaths === 0 ? totalAssists + totalKills : (totalAssists + totalKills) / totalDeaths;

  return {
    kda,
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