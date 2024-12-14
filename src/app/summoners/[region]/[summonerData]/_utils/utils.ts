import type { TChampion } from '@/app/_types/apiTypes/apiTypes';

export const findChampionById = (
  championData: Array<TChampion> | undefined,
  championId: number | string | undefined
) => {
  return championData?.find((champion) => {
    if (typeof championId === 'string') {
      return champion.key === championId;
    }
    else {
      return champion.key === championId?.toString();
    }
  });
}

export const handleKdaTextColor = (kda: number | undefined): string => {
  const basicGray = 'text-lightMode-secondMediumGray dark:text-darkMode-lighterGray';
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
      return basicGray;
    }
  }
  else {
    return basicGray;
  }
}