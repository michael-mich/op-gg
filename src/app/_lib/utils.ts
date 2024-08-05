import type { TLocalStorageSummoner } from '../_types/types';

export const getLocalStorageData = (localeStorageKey: string): Array<TLocalStorageSummoner> => {
  return JSON.parse(localStorage.getItem(localeStorageKey) || '[]');
}

export const fetchApi = async <T>(
  url: string,
  cacheValue?: { cache: 'force-cache' }
): Promise<T | void> => {
  try {
    const response = await fetch(url, cacheValue);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}