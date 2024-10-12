import type { TPromiseResult } from '@/app/_types/apiTypes/apiTypes';

export const fetchApi = async <T>(
  url: string,
  cacheValue?: { cache: 'force-cache' }
): Promise<TPromiseResult<T>> => {
  try {
    const response = await fetch(url, cacheValue);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json() as T;
    return data;
  }
  catch (error) {
    console.error(error);
  }
}