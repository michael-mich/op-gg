'use server';

import { fetchApi } from '../utils';
import type { TLecSpringSeason, TEsportMatch } from '@/app/_types/api-types';

const pandascoreApiKey = process.env.PANDASCORE_API_KEY;

export const getLecSpringSeason = async (): Promise<Array<TLecSpringSeason> | void> => {
  const url = `https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${pandascoreApiKey}`;
  return await fetchApi(url, { cache: 'force-cache' });
}

export const getMatchResultLionsVsFnatic = async (): Promise<TEsportMatch | void> => {
  const url = `https://api.pandascore.co/matches/636351?token=${pandascoreApiKey}`;
  return await fetchApi(url, { cache: 'force-cache' });
}

export const getMatchResultFnaticVsBds = async (): Promise<TEsportMatch | void> => {
  const url = `https://api.pandascore.co/matches/636358?token=${pandascoreApiKey}`;
  return await fetchApi(url, { cache: 'force-cache' });
}