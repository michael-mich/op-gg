'use server';

import {
  getFilteredChampions,
  getSummonerRank,
  getSummonerProfileData,
  getSpectatorData
} from './riotGamesApi';
import { fetchApi, findQueueTypeData } from '../../utils';
import type {
  TPromiseResult,
  TSummonerAccount,
  TLiveGameParticipants,
  TSummonerSpell,
  TSummonerSpellContent,
  TRune,
  TSegregateTeams,
  TUpdatedLiveGameParticipants,
  TTeams
} from '@/app/_types/apiTypes';
import type { TRegionData } from '@/app/_types/types';
import { QueueType, RuneType } from '@/app/_enums/enums';

const riotGamesApiKey = process.env.RIOT_API_KEY;

type TSingleTeam = { blueTeam: Array<TUpdatedLiveGameParticipants> } | { redTeam: Array<TUpdatedLiveGameParticipants> };

export const getSummonerLiveGameData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<TSegregateTeams>> => {
  const liveGameData = await getSpectatorData(regionData, summonerPuuid);
  const gameParticipants = liveGameData?.participants;

  const processGameParticipants = async <T>(callback: (parameter: TLiveGameParticipants) => T | undefined): Promise<TPromiseResult<Array<Awaited<T | undefined>>>> => {
    return liveGameData && await Promise.all(gameParticipants!.map((participantData) => {
      return callback(participantData);
    }));
  }

  const bannedChampionsWithNames = liveGameData && await Promise.all(liveGameData.bannedChampions.map(async (champion) => {
    const data = await getFilteredChampions([champion]);

    return {
      ...champion,
      championName: data?.map((d) => d.name)[0]
    };
  }));

  const championNames = await processGameParticipants(async (participantData) => {
    const data = await getFilteredChampions([participantData]);
    return data?.map((d) => {
      return {
        name: d.name,
        image: d.image.full
      }
    })[0];
  });

  const summonerRanks = await processGameParticipants(async (participantData) => {
    const rankData = await getSummonerRank(regionData, participantData.summonerId);
    return findQueueTypeData(rankData, QueueType.RankedSolo);
  });

  const summonerNames = await processGameParticipants(async (participantData) => {
    const summonerData = await fetchApi<TSummonerAccount>(`https://${regionData?.continentLink}/riot/account/v1/accounts/by-puuid/${participantData.puuid}?api_key=${riotGamesApiKey}`);
    return summonerData?.gameName;
  });

  const summonerLevels = await processGameParticipants(async (participantData) => {
    const summonerData = await getSummonerProfileData(participantData.puuid, regionData);
    return summonerData?.summonerLevel;
  });

  const allSummonerSpells = async (): Promise<TPromiseResult<Array<TSummonerSpellContent>>> => {
    const spellData = await fetchApi<TSummonerSpell>('https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/summoner.json');

    if (spellData) {
      return Object.values(spellData.data);
    }
  }
  const awaitedSummonerSpells = await allSummonerSpells();

  const summonerSpells = gameParticipants?.map((participantData) => {
    return awaitedSummonerSpells?.filter((spell) => spell.key === participantData.spell1Id.toString() || spell.key === participantData.spell2Id.toString());
  });

  const allRunes = await fetchApi<Array<TRune>>('https://ddragon.leagueoflegends.com/cdn/14.15.1/data/en_US/runesReforged.json');
  const summonerRunes = await processGameParticipants(async (participantData) => {
    return allRunes?.map((rune) => {
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
            championData: championNames?.[index],
            summonerName: summonerNames?.[index],
            summonerLevel: summonerLevels?.[index],
            spells: summonerSpells?.[index],
            runes: summonerRunes?.[index] as Array<TRune | undefined>,
            rank: summonerRanks?.[index],
            bannedChampion: bannedChampionsWithNames?.[index]
          };

          return updatedData;
        })
      };
    }
  }

  const segregateTeams = (): TSegregateTeams | undefined => {
    if (liveGameData) {
      const teams: Array<TSingleTeam> = [{ blueTeam: [] }, { redTeam: [] }];
      const gameData = updateSummonersData();
      const { participants, ...data } = gameData!;

      for (let summoner of participants || []) {
        if (summoner.teamId === 100) {
          if ('blueTeam' in teams[0]) {
            teams[0].blueTeam.push(summoner);
          }
        }
        else {
          if ('redTeam' in teams[1]) {
            teams[1].redTeam.push(summoner);
          }
        }
      }

      return {
        ...data,
        teams: teams as Array<TTeams>
      };
    }
  }

  return awaitedSummonerSpells;
}