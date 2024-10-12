'use server';

import { riotGamesApiKey } from './apiKey';
import { fetchApi } from '../../utils/fetchApi';
import type {
  TSummonerAccount,
  TSummonerProfile,
  TSummonerRank,
  TPromiseResult,
  TChampionMastery,
  TChampion,
  TChampionMasterySummary,
  TMatchHistory
} from '@/app/_types/apiTypes/apiTypes';
import type { TLiveGame, TRune } from '@/app/_types/apiTypes/liveGameTypes';
import type { TRegionData } from '@/app/_types/types';

export const getSummonerAccount = async (
  summonerName: string,
  regionData: TRegionData | undefined
): Promise<TPromiseResult<TSummonerAccount>> => {
  return await fetchApi(`https://${regionData?.continentLink}/riot/account/v1/accounts/by-riot-id/${summonerName}/${regionData?.shorthand}?api_key=${riotGamesApiKey}`);
}

export const getSummonerProfileData = async (
  puuid: string | undefined,
  regionData: TRegionData | undefined
): Promise<TPromiseResult<TSummonerProfile>> => {
  return await fetchApi(`https://${regionData?.regionLink}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${riotGamesApiKey}`);
}

export const getSummonerRank = async (
  regionData: TRegionData | undefined,
  summonerId: string | undefined
): Promise<TPromiseResult<Array<TSummonerRank>>> => {
  return await fetchApi(`https://${regionData?.regionLink}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${riotGamesApiKey}`);
}

export const getSummonerChampionsMastery = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined,
  getTopChampions: boolean
): Promise<TPromiseResult<Array<TChampionMastery>>> => {
  const data: TPromiseResult<Array<TChampionMastery>> = await fetchApi(`https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);

  const topFourChampions = data?.slice(0, 4);
  return getTopChampions ? topFourChampions : data;
}

export const getSummonerChampionsMasterySummary = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<TChampionMasterySummary>> => {
  const data: TPromiseResult<Array<TChampionMastery>> = await fetchApi(`https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);

  const totalChampionPoints = data?.reduce((acc, cur) => acc + cur.championPoints, 0).toLocaleString();
  const totalMasteryScore = data?.reduce((acc, cur) => acc + cur.championLevel, 0);

  const championMasterySummary: TChampionMasterySummary = {
    masteryChampionsAmount: data?.length,
    totalChampionPoints,
    totalMasteryScore
  };

  return championMasterySummary;
}

export const getFilteredChampions = async <T extends { championId: number }>(
  championsData: Array<T> | undefined | void
): Promise<TPromiseResult<Array<TChampion>>> => {
  const data: TPromiseResult<{ data: Record<string, TChampion> }> = await fetchApi('https://ddragon.leagueoflegends.com/cdn/14.15.1/data/en_US/champion.json');
  const champions = Object.values(data?.data || []);

  const filteredChampions = champions.filter((champion) => championsData?.find((championData) =>
    champion.key === championData.championId.toString())
  );
  return filteredChampions;
}

export const getSpectatorData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<TLiveGame>> => {
  return await fetchApi(`https://${regionData?.regionLink}/lol/spectator/v5/active-games/by-summoner/${summonerPuuid}?api_key=${riotGamesApiKey}`);
}

export const getRunesData = async (): Promise<TPromiseResult<Array<TRune>>> => {
  return await fetchApi('https://ddragon.leagueoflegends.com/cdn/14.19.1/data/en_US/runesReforged.json');
}

export const getSummonerMatchHistoryData = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<Array<TMatchHistory>>> => {
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