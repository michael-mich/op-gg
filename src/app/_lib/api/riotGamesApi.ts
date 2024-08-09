'use server';

import { fetchApi } from '../utils';
import type {
  TSummonerAccount,
  TSummonerProfile,
  TSummonerRank,
  TPromiseResult
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