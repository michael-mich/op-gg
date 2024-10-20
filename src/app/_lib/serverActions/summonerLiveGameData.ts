'use server';

import { riotGamesApiKey } from '../apiKey/riotGamesApiKey';
import {
  getFilteredChampions,
  getSummonerRank,
  getSummonerProfileData,
  getSpectatorData,
  getRunesData,
  getSummonerSpells
} from '../services/riotGamesApi';
import { fetchApi } from '../utils/fetchApi';
import { findQueueTypeData } from '../utils/utils';
import { segregateSummonersToTeams, filterSummonerSpells } from '../utils/matchStats';
import type {
  TSummonerLiveGameData,
  TUpdatedLiveGameParticipants,
  TUpdatedRune,
  TBannedChampion
} from '@/app/_types/serverActions/liveGame';
import type {
  TSummonerAccount,
  TLiveGameParticipants
} from '@/app/_types/services';
import type { TRegionData } from '@/app/_types/types';
import { QueueType, RuneType } from '@/app/_enums/enums';

const getChampionNameAndImage = async <T extends { championId: number }>(data: T) => {
  const championData = await getFilteredChampions([data]);
  return championData?.map((champion) => {
    return {
      name: champion.name,
      image: champion.image.full
    }
  })[0]
}

export const getSummonerLiveGameData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TSummonerLiveGameData | undefined> => {
  const liveGameData = await getSpectatorData(regionData, summonerPuuid);
  const gameParticipants = liveGameData?.participants;

  const processGameParticipants = async <T>(
    callback: (parameter: TLiveGameParticipants) => T | undefined
  ): Promise<Array<Awaited<T | undefined>> | undefined> => {
    return liveGameData && await Promise.all(gameParticipants!.map((participantData) => {
      return callback(participantData);
    }));
  }

  const bannedChampionsWithNames = liveGameData && await Promise.all(liveGameData.bannedChampions.map(async (champion) => {
    return await getChampionNameAndImage(champion);
  }));

  const championData = await processGameParticipants(async (participantData) => {
    return await getChampionNameAndImage(participantData);
  });

  const shardIds = await processGameParticipants(async (participantData) => {
    return participantData.perks.perkIds.slice(-3);
  });

  const summonerRanks = await processGameParticipants(async (participantData) => {
    const rankData = await getSummonerRank(regionData, participantData.summonerId);
    return findQueueTypeData(rankData, QueueType.RankedSolo);
  });

  const summonerNameAndTagLine = await processGameParticipants(async (participantData) => {
    const summonerData = await fetchApi<TSummonerAccount>(`https://${regionData?.continentLink}/riot/account/v1/accounts/by-puuid/${participantData.puuid}?api_key=${riotGamesApiKey}`);

    return {
      name: summonerData?.gameName,
      tagLine: summonerData?.tagLine
    }
  });

  const summonerLevels = await processGameParticipants(async (participantData) => {
    const summonerData = await getSummonerProfileData(participantData.puuid, regionData);
    return summonerData?.summonerLevel;
  });

  const awaitedSummonerSpells = await getSummonerSpells();

  const summonerSpells = gameParticipants?.map((participantData) =>
    filterSummonerSpells(awaitedSummonerSpells, participantData)
  );

  const allRunes = await getRunesData();
  const summonerRunes = await processGameParticipants(async (participantData) => {
    const filteredRunes = allRunes?.map((rune) => {
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

    if (filteredRunes) {
      if (filteredRunes[0]?.type === RuneType.MainRune) {
        return filteredRunes;
      }
      else {
        return [filteredRunes[1], filteredRunes[0]];
      }
    }
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

  return updateAndSegregateTeams();
}