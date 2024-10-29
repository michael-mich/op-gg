import { riotGamesApiKey } from '@/app/_lib/utils/envVariables';
import { getRouteHandlerParams, routeHandlerEndpoints } from '@/app/_lib/utils/routeHandlers';
import { fetchApi } from '@/app/_lib/utils/fetchApi';
import { filterSummonerSpells } from '@/app/_lib/utils/matchStats';
import { findQueueTypeData } from '@/app/_lib/utils/utils';
import { sortSummonerRunesByType, segregateSummonersToTeams } from '@/app/_lib/utils/matchStats';
import type { NextRequest } from 'next/server';
import type {
  TRune,
  TLiveGame,
  TChampion,
  TSummonerAccount,
  TLiveGameParticipants,
  TSummonerRank,
  TSummonerProfile,
  TSummonerSpellContent,
} from '@/app/_types/apiTypes';
import type {
  TUpdatedLiveGameParticipants,
  TUpdatedRune,
  TBannedChampion
} from '@/app/_types/customApiTypes/liveGame';
import { Spell, QueueType, RuneType } from '@/app/_enums/enums';

const getChampionNameAndImage = async <T extends { championId: number }>(data: T) => {
  const championData = await fetchApi<Array<TChampion>>(
    routeHandlerEndpoints.filteredChampions([data.championId])
  );

  return championData?.map((champion) => {
    return {
      name: champion.name,
      image: champion.image.full
    }
  })[0]
}

export const GET = async (req: NextRequest) => {
  const { summonerPuuid, regionLink, regionContinentLink } = getRouteHandlerParams(req);

  const liveGameData = await fetchApi<TLiveGame>(
    routeHandlerEndpoints.spectator(summonerPuuid, regionLink)
  );
  const runeData = await fetchApi<Array<TRune>>(
    routeHandlerEndpoints.runes()
  );
  const spellData = await fetchApi<Array<TSummonerSpellContent>>(
    routeHandlerEndpoints.summonerSpells()
  );

  const gameParticipants = liveGameData?.participants;

  const processGameParticipants = async <T>(
    callback: (parameter: TLiveGameParticipants) => T | undefined
  ): Promise<Array<Awaited<T | undefined>> | undefined> => {
    return liveGameData && await Promise.all(gameParticipants!.map((participantData) => {
      return callback(participantData);
    }));
  }

  const summonerSpells = filterSummonerSpells(Spell.Spell1Id, Spell.Spell2Id, gameParticipants, spellData);

  const bannedChampionsWithNames = liveGameData && await Promise.all(liveGameData.bannedChampions.map((champion) => {
    return getChampionNameAndImage(champion);
  }));

  const championData = await processGameParticipants((participantData) => {
    return getChampionNameAndImage(participantData);
  });

  const shardIds = gameParticipants?.map((participantData) => {
    return participantData.perks.perkIds.slice(-3);
  });

  const summonerRanks = await processGameParticipants(async (participantData) => {
    const rankData = await fetchApi<Array<TSummonerRank>>(
      routeHandlerEndpoints.summonerRank(participantData.summonerId, regionLink)
    );
    return findQueueTypeData(rankData, QueueType.RankedSolo);
  });

  const summonerNameAndTagLine = await processGameParticipants(async (participantData) => {
    const summonerData = await fetchApi<TSummonerAccount>(`https://${regionContinentLink}/riot/account/v1/accounts/by-puuid/${participantData.puuid}?api_key=${riotGamesApiKey}`);

    return {
      name: summonerData?.gameName,
      tagLine: summonerData?.tagLine
    };
  });

  const summonerLevels = await processGameParticipants(async (participantData) => {
    const summonerData = await fetchApi<TSummonerProfile>(
      routeHandlerEndpoints.summonerProfile(participantData.puuid, regionLink)
    );
    return summonerData?.summonerLevel;
  });

  const summonerRunes = gameParticipants?.map((participantData) => {
    const filteredRunes = runeData?.map((rune) => {
      const filterRunes = (runeType: RuneType) => {
        return {
          ...rune,
          slots: rune.slots.map((slotRune) => {
            return slotRune.runes.find((r) => participantData.perks.perkIds.includes(r.id));
          }).filter(Boolean),
          type: runeType
        }
      }

      if (rune.id === participantData.perks.perkStyle) {
        return filterRunes(RuneType.MainRune);
      }
      else if (rune.id === participantData.perks.perkSubStyle) {
        return filterRunes(RuneType.SubRune);
      }
    }).filter(Boolean);

    return sortSummonerRunesByType(filteredRunes);
  });

  const updateSummonersData = () => {
    if (liveGameData) {
      const { bannedChampions, ...gameData } = liveGameData;

      return {
        ...gameData,
        participants: gameParticipants?.map((participantData, index) => {
          const { championId, perks, spell1Id, spell2Id, ...summonerData } = participantData;

          const updatedData: TUpdatedLiveGameParticipants = {
            ...summonerData,
            championData: championData?.[index],
            summonerNameAndTagLine: summonerNameAndTagLine?.[index],
            summonerLevel: summonerLevels?.[index],
            spells: summonerSpells?.[index],
            runes: summonerRunes?.[index] as Array<TUpdatedRune | undefined>,
            rank: summonerRanks?.[index],
            bannedChampion: bannedChampionsWithNames?.[index] as TBannedChampion | undefined,
            shardIds: shardIds?.[index]
          };

          return updatedData;
        })
      };
    }
  }

  const updateAndSegregateTeams = () => {
    if (liveGameData) {
      const gameData = updateSummonersData();
      const { participants, ...data } = gameData!;
      const teams = segregateSummonersToTeams(participants)

      return {
        ...data,
        teams
      };
    }
  }

  return Response.json(updateAndSegregateTeams());
}