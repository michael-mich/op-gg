import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerProfileData } from '@/app/_lib/api/riotGamesApi';
import { getLocalStorageData } from '@/app/_lib/utils';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import type { TLocalStorageSummoner } from '@/app/_types/types';

type Props = {
  setDisplaySummonerLink: React.Dispatch<React.SetStateAction<boolean>>;
  pageOtherThanHomePage: boolean;
  summonerAccountData: TSummonerAccount;
  summonerName: string;
  isSuccess: boolean;
}

const SummonerLink = ({
  setDisplaySummonerLink,
  pageOtherThanHomePage,
  summonerAccountData,
  summonerName,
  isSuccess,
}: Props) => {
  const markedRegionData = useAppSelector((state) => state.markedRegionData.markedRegionData);

  const { data, refetch } = useQuery({
    enabled: false,
    queryKey: ['summonerLevelAndIconId'],
    queryFn: () => getSummonerProfileData(summonerAccountData, markedRegionData)
  });

  const searchHistoryData: TLocalStorageSummoner = {
    regionShorthand: markedRegionData.shorthand,
    summonerName: summonerAccountData.gameName,
    tagLine: summonerAccountData.tagLine,
    summonerId: data?.id
  }

  const removeDuplicateObjects = (localeStorageArray: Array<TLocalStorageSummoner>): Array<TLocalStorageSummoner> => {
    return localeStorageArray.filter((value, index, self) => index === self.findIndex((t) => (
      t.summonerId === value.summonerId
    )));
  }

  const addSearchHistoryDataToLocalStorage = (): void => {
    const storageArray = getLocalStorageData('searchHistory');
    storageArray.unshift(searchHistoryData);
    const withoutDuplicates = removeDuplicateObjects(storageArray);
    localStorage.setItem('searchHistory', JSON.stringify(withoutDuplicates));
  }

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [summonerAccountData.puuid]);

  return (
    <div className={`${summonerName.length > 0 ? 'block' : 'hidden'} ${pageOtherThanHomePage ? 'top-8 max-w-[472px]' : 'top-[3.2rem]'} absolute left-0 z-50 
    w-full bg-white dark:bg-darkMode-mediumGray rounded-b shadow-custom-shadow`}
    >
      <Link
        onClick={() => {
          addSearchHistoryDataToLocalStorage();
          setDisplaySummonerLink(false);
        }}
        className='flex items-center gap-2 py-1.5 px-4 transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray rounded-b'
        href={`/summoners/${markedRegionData.shorthand.toLowerCase()}/${summonerAccountData.gameName}-${summonerAccountData.tagLine}`}
      >
        <Image
          className='w-9 rounded-full aspect-square'
          src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${data?.profileIconId}.png`}
          width={30}
          height={30}
          alt=""
          aria-hidden="true"
        />
        <div className='flex flex-col'>
          <div>
            <span className='text-sm mr-1'>{summonerAccountData.gameName}</span>
            <span className='text-sm text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
              #{summonerAccountData.tagLine}
            </span>
          </div>
          <span className='text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'>
            Level {data?.summonerLevel}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default SummonerLink;