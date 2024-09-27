import type { TPromiseResult, TSummonerRank } from '../../_types/apiTypes';
import type { TLocalStorageSummoner } from '../../_types/types';
import { LocalStorageKeys, QueueType } from '../../_enums/enums';

export const getLocalStorageData = (localeStorageKey: LocalStorageKeys): Array<TLocalStorageSummoner> => {
  return JSON.parse(localStorage.getItem(localeStorageKey) || '[]');
}

export const findQueueTypeData = (queueData: TPromiseResult<Array<TSummonerRank>>, queueType: QueueType): TSummonerRank | undefined => {
  return queueData?.find((data) => data.queueType === queueType);
}

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