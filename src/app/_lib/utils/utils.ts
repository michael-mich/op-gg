import type { TPromiseResult, TSummonerRank } from '../../_types/apiTypes/apiTypes';
import type { TLocalStorageSummoner } from '../../_types/types';
import { LocalStorageKeys, QueueType, TimeUnit } from '../../_enums/enums';

export const getLocalStorageData = (localeStorageKey: LocalStorageKeys): Array<TLocalStorageSummoner> => {
  return JSON.parse(localStorage.getItem(localeStorageKey) || '[]');
}

export const findQueueTypeData = (queueData: TPromiseResult<Array<TSummonerRank>>, queueType: QueueType): TSummonerRank | undefined => {
  return queueData?.find((data) => data.queueType === queueType);
}

export const calculateTimeUnit = (gameDuration: number | undefined, timeUnit: TimeUnit): number => {
  if (gameDuration && gameDuration > 0) {
    return timeUnit === TimeUnit.Minutes ? Math.floor(gameDuration / 60) : Math.floor(gameDuration % 60);
  }
  else {
    return 0;
  }
}

export const handleKdaTextColor = (kda: number): string => {
  if (kda >= 6.0) {
    return 'text-orange';
  }
  else if (kda >= 4.0) {
    return 'text-secondLightBlue';
  }
  else if (kda >= 3.0) {
    return 'text-mediumGreen';
  }
  else {
    return 'text-lightMode-secondMediumGray dark:text-darkMode-lighterGray';
  }
}