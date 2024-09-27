'use server';

import { fetchApi } from '../utils/utils';
import type { TLecSpringSeason, TEsportMatch, TPromiseResult } from '@/app/_types/apiTypes';

const pandascoreApiKey = process.env.PANDASCORE_API_KEY;

export const getLecSpringSeason = async (): Promise<Array<TPromiseResult<TLecSpringSeason>> | void> => {
  const url = `https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${pandascoreApiKey}`;
  return await fetchApi(url, { cache: 'force-cache' });
}

export const getMatchResultLionsVsFnatic = async (): Promise<TPromiseResult<TEsportMatch>> => {
  const url = `https://api.pandascore.co/matches/636351?token=${pandascoreApiKey}`;
  return await fetchApi(url, { cache: 'force-cache' });
}

export const getMatchResultFnaticVsBds = async (): Promise<TPromiseResult<TEsportMatch>> => {
  const url = `https://api.pandascore.co/matches/636358?token=${pandascoreApiKey}`;
  return await fetchApi(url, { cache: 'force-cache' });
}