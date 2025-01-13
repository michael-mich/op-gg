import type {
  TSummonerDetailedMatchHistory,
  TDetailedMatchHistory
} from '@/app/_types/apiTypes/customApiTypes';

export const getFormattedKillParticipation = (
  summoner: TSummonerDetailedMatchHistory | undefined
): number => {
  return summoner ? Math.round(summoner.challenges.killParticipation * 100) : 0;
}

export const getFormattedKda = (summoner: TSummonerDetailedMatchHistory | undefined): string => {
  if (summoner?.kills !== 0 && summoner?.deaths === 0 && summoner?.assists !== 0) {
    return 'Perfect';
  } else {
    return `${summoner?.challenges?.kda.toFixed(2)}:1`;
  }
}

export const adjustTeamsOrderBasedOnSummoner = <T>(
  currentSummoner: TSummonerDetailedMatchHistory | undefined,
  teams: Array<T> | undefined
): Array<T | undefined> | undefined => {
  if (currentSummoner?.teamId === 100) {
    return teams;
  } else {
    const blueTeam = teams?.[0];
    const redTeam = teams?.[1];
    return [redTeam, blueTeam];
  }
}

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
    };
  };
}