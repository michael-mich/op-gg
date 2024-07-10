'use server';

import type { TLecSpringSeason, TEsportMatch } from './api-types';

const pandascoreApiKey = process.env.PANDASCORE_API_KEY;

export const getLecSpringSeason = async (): Promise<Array<TLecSpringSeason> | undefined> => {
  try {
    const response = await fetch(`https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${pandascoreApiKey}`, { cache: 'force-cache' });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}

export const getMatchResultLionsVsFnatic = async (): Promise<TEsportMatch | undefined> => {
  try {
    const response = await fetch(`https://api.pandascore.co/matches/636351?token=${pandascoreApiKey}`, { cache: 'force-cache' });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}

export const getMatchResultFnaticVsBds = async (): Promise<TEsportMatch | undefined> => {
  try {
    const response = await fetch(`https://api.pandascore.co/matches/636358?token=${pandascoreApiKey}`, { cache: 'force-cache' });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}