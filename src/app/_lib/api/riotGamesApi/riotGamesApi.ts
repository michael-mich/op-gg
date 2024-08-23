'use server';

import { fetchApi } from '../../utils';
import type {
  TSummonerAccount,
  TSummonerProfile,
  TSummonerRank,
  TPromiseResult,
  TChampionMastery,
  TChampion
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
  summonerAccountData: TSummonerAccount,
  regionData: TRegionData | undefined
): Promise<TPromiseResult<TSummonerProfile>> => {
  const url = `https://${regionData?.regionLink}/lol/summoner/v4/summoners/by-puuid/${summonerAccountData.puuid}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}

export const getSummonerRank = async (
  regionData: TRegionData | undefined,
  summonerId: string | undefined
): Promise<TPromiseResult<Array<TSummonerRank>>> => {
  const url = `https://${regionData?.regionLink}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}

export const getTopFourSummonerChampionsMastery = async (
  regionData: TRegionData | undefined,
  summonerPuuid: string | undefined
): Promise<TPromiseResult<Array<TChampionMastery>>> => {
  const response = await fetch(`https://${regionData?.regionLink}/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerPuuid}?api_key=${riotGamesApiKey}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  const topFourChampions = await data.slice(0, 4);
  return topFourChampions;
}

export const getFilteredChampionsByMastery = async (
  championsMasteryData: Array<TChampionMastery> | undefined | void
): Promise<TPromiseResult<Array<TChampion>>> => {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/cdn/14.15.1/data/en_US/champion.json');
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    const champions = Object.values(data.data as Array<TChampion>);
    const filteredChampions = champions.filter((champion) => championsMasteryData?.some((championMastery) =>
      champion.key === championMastery.championId.toString()));
    return filteredChampions;
  }
  catch (error) {
    console.error(error)
  }
}