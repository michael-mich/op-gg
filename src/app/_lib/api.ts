'use server';

const options = { method: 'GET', headers: { accept: 'application/json' } };

export const getLecSpringSeason = async () => {
  try {
    const response = await fetch(`https://api.pandascore.co/tournaments/league-of-legends-lec-spring-2024-regular-season/standings?page=size=50&per_page=50&token=${process.env.PANDASCORE_API_KEY}`, options);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}