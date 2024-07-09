'use server';

import { TLecSpringSeason } from './api-types';

export const getLecSpringSeason = async (): Promise<Array<TLecSpringSeason> | undefined> => {
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  try {
    const response = await fetch(`https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=number=1&size=6&per_page=50&token=${process.env.PANDASCORE_API_KEY}`, options);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}