'use server';

import { fetchApi } from '../utils/fetchApi';
import type { TLecSpringSeason, TEsportMatch } from '@/app/_types/services';

const pandascoreApiKey = process.env.PANDASCORE_API_KEY;

export const getLecSpringSeason = async (): Promise<Array<TLecSpringSeason> | undefined> => {
  return await fetchApi(`https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${pandascoreApiKey}`);
}

export const getMatchResultLionsVsFnatic = async (): Promise<TEsportMatch | undefined> => {
  return await fetchApi(`https://api.pandascore.co/matches/636351?token=${pandascoreApiKey}`);
}

export const getMatchResultFnaticVsBds = async (): Promise<TEsportMatch | undefined> => {
  return await fetchApi(`https://api.pandascore.co/matches/636358?token=${pandascoreApiKey}`);
}