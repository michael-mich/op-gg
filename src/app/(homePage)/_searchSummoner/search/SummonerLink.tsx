import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { getSummonerProfileData } from '@/app/_lib/api/riotGamesApi';
import type { TSummonerAccount } from '@/app/_types/apiTypes';
import type { TLocalStorageSummoner } from '@/app/_types/types';

type Props = {
  summonerAccountData: TSummonerAccount;
  summonerName: string;
  getLocalStorageData: (localStorageKey: string) => Array<TLocalStorageSummoner>;
  isSuccess: boolean;
}

const SummonerLink = ({
  summonerAccountData,
  summonerName,
  getLocalStorageData,
  isSuccess,
}: Props) => {
  const regionData = useAppSelector((state) => state.regionData.regionData);

  const { data, refetch } = useQuery({
    enabled: false,
    queryKey: ['summonerLevelAndIconId'],
    queryFn: () => getSummonerProfileData(summonerAccountData, regionData)
  });

  const searchHistoryData = {
    regionShorthand: regionData.shorthand,
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
    <div className={`${summonerName.length > 0 ? 'block' : 'hidden'} absolute top-[3.2rem] left-0 z-10 
    w-full bg-white dark:bg-darkMode-mediumGray rounded-b`}
    >
      <Link
        onClick={addSearchHistoryDataToLocalStorage}
        className='flex items-center gap-2 py-1.5 px-4 transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray rounded-b'
        href={`/summoners/${regionData.shorthand.toLowerCase()}/${summonerAccountData.gameName}-${summonerAccountData.tagLine}`}
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