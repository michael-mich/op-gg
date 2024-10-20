'use server';

import { riotGamesApiKey } from '../apiKey/riotGamesApiKey';
import { fetchApi } from '../utils/fetchApi';
import type {
  TSummonerAccount,
  TSummonerProfile,
  TSummonerRank,
  TChampionMastery,
  TChampion,
  TChampionMasterySummary,
  TMatchHistory,
  TSummonerSpell,
  TSummonerSpellContent,
  TRune,
  TLiveGame
} from '@/app/_types/services';
import type { TRegionData } from '@/app/_types/types';

export const getRunesData = async (): Promise<Array<TRune> | undefined> => {
  return await fetchApi('https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/runesReforged.json');
}

export const getSummonerAccount = async (
  summonerName: string,
  regionData: TRegionData | undefined
): Promise<TSummonerAccount | undefined> => {
  return await fetchApi(`https://${regionData?.continentLink}/riot/account/v1/accounts/by-riot-id/${summonerName}/${regionData?.shorthand}?api_key=${riotGamesApiKey}`);
}

export const getSummonerProfileData = async (
  puuid: string | undefined,
  regionData: TRegionData | undefined
): Promise<TSummonerProfile | undefined> => {
  return await fetchApi(`https://${regionData?.regionLink}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${riotGamesApiKey}`);
}

export const getSummonerRank = async (
  regionData: TRegionData | undefined,
  summonerId: string | undefined
): Promise<Array<TSummonerRank> | undefined> => {
  return await fetchApi(`https://${regionData?.regionLink}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${riotGamesApiKey}`);
}

export const getSummonerChampionsMastery = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined,
  getTopChampions: boolean
): Promise<Array<TChampionMastery> | undefined> => {
  const data = await fetchApi<Array<TChampionMastery>>(`https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);

  const topFourChampions = data?.slice(0, 4);
  return getTopChampions ? topFourChampions : data;
}

export const getSummonerSpells = async (): Promise<Array<TSummonerSpellContent> | undefined> => {
  const spellData = await fetchApi<TSummonerSpell>('https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/summoner.json');

  if (spellData) {
    return Object.values(spellData.data);
  }
}

export const getSummonerChampionsMasterySummary = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TChampionMasterySummary | undefined> => {
  const data = await fetchApi<Array<TChampionMastery>>(`https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);

  const totalChampionPoints = data?.reduce((acc, cur) => acc + cur.championPoints, 0).toLocaleString();
  const totalMasteryScore = data?.reduce((acc, cur) => acc + cur.championLevel, 0);

  const championMasterySummary: TChampionMasterySummary = {
    masteryChampionsAmount: data?.length,
    totalChampionPoints,
    totalMasteryScore
  };

  return championMasterySummary;
}

export const getSpectatorData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TLiveGame | undefined> => {
  return await fetchApi(`https://${regionData?.regionLink}/lol/spectator/v5/active-games/by-summoner/${summonerPuuid}?api_key=${riotGamesApiKey}`);
}

export const getFilteredChampions = async <T extends { championId: number }>(
  championsData: Array<T> | undefined | void
): Promise<Array<TChampion> | undefined> => {
  const data = await fetchApi<{ data: Record<string, TChampion> }>('https://ddragon.leagueoflegends.com/cdn/14.15.1/data/en_US/champion.json');
  const champions = Object.values(data?.data || []);

  const filteredChampions = champions.filter((champion) => championsData?.find((championData) =>
    champion.key === championData.championId.toString())
  );
  return filteredChampions;
}

export const getSummonerMatchHistoryData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<Array<TMatchHistory> | undefined> => {
  const matchIds = await fetchApi<Array<string>>(`https://${regionData?.continentLink}/lol/match/v5/matches/by-puuid/${summonerPuuid}/ids?start=0&count=20&api_key=${riotGamesApiKey}`);
  const matchHistoryData = [] as Array<TMatchHistory>;

  // for loop is used to sequentially fetch detailed match data
  if (matchIds) {
    for (const id of matchIds) {
      const matchData = await fetchApi<TMatchHistory>(`https://${regionData?.continentLink}/lol/match/v5/matches/${id}?api_key=${riotGamesApiKey}`);
      matchData && matchHistoryData.push(matchData);
    };
  }

  return matchHistoryData;
}