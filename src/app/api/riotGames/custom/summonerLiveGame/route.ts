import { getRouteHandlerParams } from '@/app/_utils/routeHandlers';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { fetchApi } from '@/app/_utils/fetchApi';
import { segregateSummonersToTeams, getSummonersRank } from '@/app/_utils/matchStats';
import type { NextRequest } from 'next/server';
import type { TLiveGame, TSummonerProfile } from '@/app/_types/apiTypes/apiTypes';

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
            getSummonersRank(summoner, regionLink),
            fetchApi<TSummonerProfile>(riotGamesRoutes.summonerProfile(summoner.puuid, regionLink))
          ]);

          const shardIds = summoner.perks.perkIds.slice(-3);

          return {
            ...summoner,
            rank: summonerRank,
            summonerLevel: summonerProfile?.summonerLevel,
            shardIds,
            bannedChampion: liveGameData.bannedChampions[summonerIndex]
          };
        }))
      }
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