import type { TLocalStorageSummoner } from '../_types/types';
import { type LocalStorageKeys, TimeUnit } from '../_enums/enums';

export const getDifferenceBetweenCurrentDate = (dateInMilliseconds: number) => {
  const currentDateMilliseconds = new Date().valueOf();

  const diffBetweenDateInMilliseconds = currentDateMilliseconds - dateInMilliseconds;
  const daysDifference = Math.floor(diffBetweenDateInMilliseconds / (1000 * 60 * 60 * 24));
  const monthsDifference = Math.floor(daysDifference / 30);

  return {
    diffBetweenDateInMilliseconds,
    daysDifference,
    monthsDifference
  };
}

export const getLocalStorageData = (localeStorageKey: LocalStorageKeys): Array<TLocalStorageSummoner> | undefined => {
  if (typeof window === 'object') {
    return JSON.parse(localStorage.getItem(localeStorageKey) || '[]');
  }
}

export const calculateTimeUnit = (seconds: number | undefined, timeUnit: TimeUnit): number => {
  if (seconds && seconds > 0) {
    return timeUnit === TimeUnit.Minutes ? Math.floor(seconds / 60) : Math.floor(seconds % 60);
  }
  else {
    return 0;
  }
}

export const handleKdaTextColor = (kda: number | undefined): string => {
  if (kda) {
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
  else {
    return '';
  }
}