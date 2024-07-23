'use server';

import { checkResponse } from '../utils';
import type { TSummonerAccount, TSummonerLevelAndIconId } from '@/app/_types/api-types';
import type { TRegionData } from '@/app/_types/types';

const riotGamesApiKey = process.env.RIOT_API_KEY;

export const getSummonerAccount = async (
  summonerName: string,
  regionData: TRegionData
): Promise<TSummonerAccount | void> => {
  try {
    const response = await fetch(`https://${regionData.continentLink}/riot/account/v1/accounts/by-riot-id/${summonerName}/${regionData.shorthand}?api_key=${riotGamesApiKey}`);
    checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}

export const getSummonerLevelAndIconId = async (
  summonerAccountData: TSummonerAccount,
  regionData: TRegionData
): Promise<TSummonerLevelAndIconId | void> => {
  try {
    const response = await fetch(`https://${regionData.regionLink}/lol/summoner/v4/summoners/by-puuid/${summonerAccountData.puuid}?api_key=${riotGamesApiKey}`)
    checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}