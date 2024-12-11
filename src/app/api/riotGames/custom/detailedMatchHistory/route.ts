import { fetchApi } from '@/app/_utils/fetchApi';
import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import {
  getSummonersRank,
  isRecognizedQueueId,
  filterMatchesByMonths,
  segregateSummonersToTeams
} from '@/app/_utils/matchStats';
import type { NextRequest } from 'next/server';
import type { TMatchHistory, TSummonerMatchHistoryData } from '@/app/_types/apiTypes/apiTypes';
import type { TTeamGeneric } from '@/app/_types/apiTypes/customApiTypes';

export const GET = async (req: NextRequest) => {
  const {
    summonerPuuid,
    regionContinentLink,
    regionLink,
    matchHistoryStartIndex
  } = getRouteHandlerParams(req);

  const fetchedHistoryMatch = await fetchApi<Array<TMatchHistory>>(
    riotGamesRoutes.summonerMatchHistory(
      summonerPuuid,
      regionContinentLink,
      '10',
      matchHistoryStartIndex
    )
  );
  const recentMatches = filterMatchesByMonths(fetchedHistoryMatch);
  const matchHistoryData = isRecognizedQueueId(recentMatches);

  const summonersDataWithRank = matchHistoryData && await Promise.all(matchHistoryData?.map((match) =>
    Promise.all(match.info.participants.map(async (summoner) => {
      const rank = await getSummonersRank(summoner, regionLink);
      return {
        ...summoner,
        rank
      };
    })))
  );

  const processedMatchData = matchHistoryData?.map((match, matchIndex) => {
    return {
      ...match,
      info: {
        ...match.info,
        participants: segregateSummonersToTeams(summonersDataWithRank?.[matchIndex]).map((team) => ({
          ...team,
          teamParticipants: team.teamParticipants.map((summoner, summonerIndex) => {
            return sortSummonerByPosition(summoner, team, summonerIndex);
          })
        }))
      }
    };
  });

  return Response.json(processedMatchData);
}

const orderedPositions = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

const sortSummonerByPosition = (
  summoner: TSummonerMatchHistoryData | undefined,
  team: TTeamGeneric<TSummonerMatchHistoryData>,
  summonerIndex: number
) => {
  const currentPosition = orderedPositions[summonerIndex];
  // Some queues don't include position, e.g. ARAM
  if (summoner?.teamPosition === currentPosition || summoner?.teamPosition === '') {
    return summoner;
  }
  else {
    return team.teamParticipants.find((findSum) =>
      findSum?.teamPosition === currentPosition
    );
  }
}