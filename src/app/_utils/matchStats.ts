import { fetchApi } from './fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { getDifferenceBetweenCurrentDate } from './utils';
import type {
  TSummonerRank,
  TSummonerMatchHistoryData,
  TSummonerSpellId,
  TSpellId,
  TSummonerSpellContent,
  TMatchHistory
} from '@/app/_types/apiTypes/apiTypes';
import type {
  TTeamGeneric,
  TAverageKdaStats,
  TChampionWinLostRatio,
  TSummonerDetailedMatchHistory,
  TDetailedMatchHistory
} from '../_types/apiTypes/customApiTypes';
import { type Spell, RuneType, QueueType, QueueId } from '@/app/_enums/match';

type TSummonerData = Array<Pick<TSummonerMatchHistoryData, 'assists' | 'deaths' | 'kills'>>;

type SpellKeys<T> = T extends TSummonerSpellId ? keyof TSummonerSpellId : keyof TSpellId;

export const calculatePercentage = (
  part: number | undefined,
  total: number | undefined
): number => {
  if (part && total) {
    return Math.round((part / total) * 100);
  }
  else {
    return 0;
  }
}

export const filterMatchesByMonths = (matchHistory: Array<TMatchHistory> | undefined) => {
  const maxMonthsSinceLastMatchPlay = 6;
  return matchHistory?.filter((match) => {
    const { monthsDifference } = getDifferenceBetweenCurrentDate(match.info.gameEndTimestamp);
    return monthsDifference <= maxMonthsSinceLastMatchPlay;
  });
}

export const isRecognizedQueueId = (matchHistory: Array<TMatchHistory> | undefined) => {
  return matchHistory?.filter((match) => {
    const queueIdEntries = Object.entries(QueueId);
    const numericQueueIds = queueIdEntries.filter(([key]) => !isNaN(parseInt(key)));
    return numericQueueIds.some(([key]) => parseInt(key) === match.info.queueId);
  });
}

export const findQueueTypeData = (
  queueData: Array<TSummonerRank> | undefined,
  queueType: QueueType
): TSummonerRank | undefined => {
  return queueData?.find((data) => data.queueType === queueType);
}

export const getSummonersRank = async <T extends Pick<TSummonerMatchHistoryData, 'summonerId'>>(
  summonerData: T,
  regionLink: string | null
) => {
  const rankData = await fetchApi<Array<TSummonerRank>>(
    riotGamesRoutes.summonerRank(summonerData.summonerId, regionLink)
  );
  return findQueueTypeData(rankData, QueueType.RankedSolo);
}

export const calculateWinLossStats = (
  matchData: Array<Pick<TSummonerMatchHistoryData, 'win' | 'gameEndedInEarlySurrender'>> | undefined
): TChampionWinLostRatio => {
  let wonMatches = 0;
  let lostMatches = 0;

  matchData?.forEach((summoner) => {
    if (summoner.win && !summoner.gameEndedInEarlySurrender) {
      wonMatches++;
    }
    else if (!summoner.gameEndedInEarlySurrender) {
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

export const calculateKda = (deaths: number, assists: number, kills: number) => {
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

export const getSummonerMinionStats = (
  summoner: TSummonerDetailedMatchHistory | undefined,
  match: TDetailedMatchHistory | undefined
) => {
  if (summoner && match) {
    const totalMinions = summoner?.totalMinionsKilled + summoner?.neutralMinionsKilled;
    const minionsPerMinute = +(totalMinions / (match?.info.gameDuration / 60)).toFixed(1);

    return {
      minionsPerMinute,
      totalMinions,
      minions: summoner?.totalMinionsKilled
    }
  };
}