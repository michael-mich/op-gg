import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { fetchApi } from '@/app/_utils/fetchApi';
import { findQueueTypeData } from '@/app/_utils/rank';
import { segregateSummonersToTeams } from '@/app/_utils/matchRouteUtils';
import type { NextRequest } from 'next/server';
import type { TLiveGame, TSummonerProfile, TSummonerRank } from '@/app/_types/apiTypes/apiTypes';
import { QueueType } from '@/app/_enums/queue';

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink } = getRouteHandlerParams(req);

  const liveGameData = await fetchApi<TLiveGame>(
    riotGamesRoutes.spectator(summonerPuuid, regionLink)
  );

  const updateLiveGameData = async () => {
    if (liveGameData) {
      return {
        ...liveGameData,
        participants: await Promise.all(liveGameData.participants.map(async (summoner, summonerIndex) => {
          const [summonerRank, summonerProfile] = await Promise.all([
            fetchApi<Array<TSummonerRank>>(riotGamesRoutes.summonerRank(summoner.summonerId, regionLink)),
            fetchApi<TSummonerProfile>(riotGamesRoutes.summonerProfile(summoner.puuid, regionLink))
          ]);

          const rankedSolo = findQueueTypeData(summonerRank, QueueType.RankedSolo);
          const shardIds = summoner.perks.perkIds.slice(-3);

          return {
            ...summoner,
            rank: rankedSolo,
            summonerLevel: summonerProfile?.summonerLevel,
            shardIds,
            bannedChampion: liveGameData.bannedChampions[summonerIndex]
          };
        }))
      };
    }
  }

  const processedLiveGameData = await updateLiveGameData();

  const enhanceLiveGameDataWithTeams = () => {
    if (liveGameData) {
      const teams = segregateSummonersToTeams(processedLiveGameData?.participants);

      return {
        ...processedLiveGameData,
        teams
      };
    }
  }

  return Response.json(enhanceLiveGameDataWithTeams());
}