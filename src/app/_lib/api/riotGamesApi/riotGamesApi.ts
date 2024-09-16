'use server';

import { fetchApi } from '../../utils';
import type {
  TSummonerAccount,
  TSummonerProfile,
  TSummonerRank,
  TPromiseResult,
  TChampionMastery,
  TChampion,
  TChampionMasterySummary,
  TLiveGame
} from '@/app/_types/apiTypes';
import type { TRegionData } from '@/app/_types/types';

const riotGamesApiKey = process.env.RIOT_API_KEY;

export const getSummonerAccount = async (
  summonerName: string,
  regionData: TRegionData | undefined
): Promise<TPromiseResult<TSummonerAccount>> => {
  const url = `https://${regionData?.continentLink}/riot/account/v1/accounts/by-riot-id/${summonerName}/${regionData?.shorthand}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}

export const getSummonerProfileData = async (
  puuid: string | undefined,
  regionData: TRegionData | undefined
): Promise<TPromiseResult<TSummonerProfile>> => {
  const url = `https://${regionData?.regionLink}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}

export const getSummonerRank = async (
  regionData: TRegionData | undefined,
  summonerId: string | undefined
): Promise<TPromiseResult<Array<TSummonerRank>>> => {
  const url = `https://${regionData?.regionLink}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}

export const getSummonerChampionsMastery = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined,
  getTopChampions: boolean
): Promise<TPromiseResult<Array<TChampionMastery>>> => {
  const url = `https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`;
  const data: TPromiseResult<Array<TChampionMastery>> = await fetchApi(url);

  const topFourChampions = data?.slice(0, 4);
  return getTopChampions ? topFourChampions : data;
}

export const getSummonerChampionsMasterySummary = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<TChampionMasterySummary>> => {
  const url = `https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`;
  const data: TPromiseResult<Array<TChampionMastery>> = await fetchApi(url);

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