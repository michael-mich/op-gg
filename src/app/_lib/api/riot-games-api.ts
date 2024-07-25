'use server';

import { fetchApi } from '../utils';
import type { TSummonerAccount, TSummonerProfile } from '@/app/_types/api-types';
import type { TRegionData } from '@/app/_types/types';

const riotGamesApiKey = process.env.RIOT_API_KEY;

export const getSummonerAccount = async (
  summonerName: string,
  regionData: TRegionData
): Promise<TSummonerAccount | void> => {
  const url = `https://${regionData.continentLink}/riot/account/v1/accounts/by-riot-id/${summonerName}/${regionData.shorthand}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}

export const getSummonerProfileData = async (
  summonerAccountData: TSummonerAccount,
  regionData: TRegionData
): Promise<TSummonerProfile | void> => {
  const url = `https://${regionData.regionLink}/lol/summoner/v4/summoners/by-puuid/${summonerAccountData.puuid}?api_key=${riotGamesApiKey}`;
  return await fetchApi(url);
}