import { BASE_URL } from './constants';
import { RouteHandlerParams } from '../_enums/routeHandler';

type Nullable<T> = T | undefined | null;

enum RouteHandlers {
  Pandascore = '/api/pandascore',
  RiotGames = '/api/riotGames',
}

const createRouteUrl = (
  routeHandler: RouteHandlers,
  subRoute: string,
  params?: Record<string, string | Array<number> | boolean | null | undefined> | undefined
) => {
  const queryParamsEntries = Object.entries(params || {});
  const queryParams = queryParamsEntries.map(([key, value]) => `${key}=${value}`).join('&');
  const url = `${BASE_URL}${routeHandler}/${subRoute}`;

  if (params) {
    return `${url}?${queryParams}`;
  }
  else {
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
  runes: () => {
    return createRouteUrl(RouteHandlers.RiotGames, 'runes');
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
  filteredChampions: (championIds: Array<number> | undefined) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'filteredChampions',
      { [RouteHandlerParams.ChampionIds]: championIds }
    );
  },
  summonerMatchHistory: (
    summonerPuuid: string | null,
    regionContinentLink: string | null,
    matchesCount: string | null
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      'summonerMatchHistory',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MatchesCount]: matchesCount
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
      RouteHandlers.RiotGames,
      '/custom/summonerChampionsMasterySummary',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink
      }
    );
  },
  detailedMatchHistory: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    markedChampionId: string,
    mathcesCount: string | null
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      '/custom/detailedMatchHistory',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MarkedChampionId]: markedChampionId,
        [RouteHandlerParams.MatchesCount]: mathcesCount
      }
    );
  },
  recentGamesSummary: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    markedChampionId: string,
    matchesCount: string | null,
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      '/custom/recentGamesSummary',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MarkedChampionId]: markedChampionId,
        [RouteHandlerParams.MatchesCount]: matchesCount
      }
    );
  },
  summonerChampionStats: (
    summonerPuuid: Nullable<string>,
    regionContinentLink: Nullable<string>,
    mathcesCount: string | null
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      '/custom/summonerChampionStats',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink,
        [RouteHandlerParams.MatchesCount]: mathcesCount
      }
    );
  },
  summonerLiveGame: (
    summonerPuuid: Nullable<string>,
    regionLink: Nullable<string>,
    regionContinentLink: Nullable<string>
  ) => {
    return createRouteUrl(
      RouteHandlers.RiotGames,
      '/custom/summonerLiveGame',
      {
        [RouteHandlerParams.SummonerPuuid]: summonerPuuid,
        [RouteHandlerParams.RegionLink]: regionLink,
        [RouteHandlerParams.RegionContinentLink]: regionContinentLink
      }
    );
  }
};