import { BASE_URL } from './constants';
import { RouteHandlerParams } from '../_enums/routeHandler';

type Nullable<T> = T | undefined | null;

enum RouteHandlers {
  Pandascore = '/api/pandascore',
  RiotGames = '/api/riotGames/riot',
  RiotGamesCustom = '/api/riotGames/custom'
}

const createRouteUrl = <T,>(
  routeHandler: RouteHandlers,
  subRoute: string,
  params?: Record<string, T | undefined> | undefined
) => {
  const queryParamsEntries = Object.entries(params || {});
  const queryParams = queryParamsEntries.map(([key, value]) => `${key}=${value}`).join('&');
  const url = `${BASE_URL}${routeHandler}/${subRoute}`;

  if (params) {
    return `${url}?${queryParams}`;
  } else {
    return url;
  }
}

export const pandascoreRoutes = {
  lecSpringSeason: () => {
    return createRouteUrl(RouteHandlers.Pandascore, 'lecSpringSeason');
  },
  matchResultFnaticVsBds: () => {
    return createRouteUrl(RouteHandlers.Pandascore, 'matchResultFnaticVsBds');
  },
  matchResultLionsVsFnatic: () => {
    return createRouteUrl(RouteHandlers.Pandascore, 'matchResultLionsVsFnatic');
  }
};

export const riotGamesRoutes = {
  newestGameVersion: () => {
    return createRouteUrl(RouteHandlers.RiotGames, 'newestGameVersion');
  },
  runes: () => {
    return createRouteUrl(RouteHandlers.RiotGames, 'runes');
  },
  championItems: () => {
    return createRouteUrl(RouteHandlers.RiotGames, 'championItems');
  },
  summonerAccount: (
    summonerName: string,
    regionContinentLink: Nullable<string>,
    regionShortHand: Nullable<string>
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'summonerAccount',
      {
        [RouteHandlerParams.SummonerName]: summonerName,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.RegionShorthand]: regionShortHand,
      }
    );
  },
  summonerProfile: (summonerPuuid: Nullable<string>, regionLink: Nullable<string>) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'summonerProfile',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink
      }
    );
  },
  summonerRank: (summonerId: Nullable<string>, regionLink: Nullable<string>) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'summonerRank',
      {
        [RouteHandlerParams.SummonerId]: summonerId,
        [RouteHandlerParams.RegionLink]: regionLink
      }
    )
  },
  summonerChampionMastery: (
    summonerPuuid: Nullable<string>,
    regionLink: Nullable<string>,
    getTopChampions: string | boolean | null
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'summonerChampionMastery',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink,
        [RouteHandlerParams.GetTopChampions]: getTopChampions
      }
    )
  },
  summonerSpells: () => {
    return createRouteUrl(RouteHandlers.RiotGames, 'summonerSpells');
  },
  spectator: (summonerPuuid: Nullable<string>, regionLink: Nullable<string>) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'spectator',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink
      }
    );
  },
  championData: () => {
    return createRouteUrl(RouteHandlers.RiotGames, 'championData');
  },
  summonerMatchHistory: (
    summonerPuuid: string | null,
    regionContinentLink: string | null,
    matchHistoryCount: string | null,
    matchHistoryStartIndex: string | null
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'summonerMatchHistory',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MatchHistoryCount]: matchHistoryCount,
        [RouteHandlerParams.MatchHistoryStartIndex]: matchHistoryStartIndex
      }
    );
  },
};

export const riotGamesCustomRoutes = {
  summonerChampionsMasterySummary: (
    summonerPuuid: string | undefined,
    regionLink: string | undefined
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGamesCustom,
      'summonerChampionsMasterySummary',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink
      }
    );
  },
  detailedMatchHistory: (
    summonerPuuid: string | undefined,
    regionContinentLink: string | undefined,
    matchHistoryStartIndex: string | null
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGamesCustom,
      'detailedMatchHistory',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MatchHistoryStartIndex]: matchHistoryStartIndex
      }
    );
  },
  matchHistorySummary: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    markedChampionId: string,
    matchHistoryCount: string | null,
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGamesCustom,
      'matchHistorySummary',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MarkedChampionId]: markedChampionId,
        [RouteHandlerParams.MatchHistoryCount]: matchHistoryCount,
      }
    );
  },
  summonerChampionStats: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGamesCustom,
      'summonerChampionStats',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
      }
    );
  },
  summonerLiveGame: (
    summonerPuuid: Nullable<string>,
    regionLink: string | undefined,
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGamesCustom,
      'summonerLiveGame',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink,
      }
    );
  }
};