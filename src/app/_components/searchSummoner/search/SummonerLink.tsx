import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/reduxHooks';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import { getLocalStorageData } from '@/app/_utils/utils';
import type { TSummonerAccount, TSummonerProfile } from '@/app/_types/apiTypes/apiTypes';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import type { TSetState } from '@/app/_types/tuples';
import { LocalStorageKeys } from '@/app/_enums/enums';

type Props = {
  setDisplaySummonerLink: TSetState<boolean>;
  pageOtherThanHomePage: boolean;
  summonerAccountData: TSummonerAccount;
  summonerName: string;
  setSummonerName: TSetState<string>;
  setDisplaySummonerSections: TSetState<boolean>;
  isSummonerAccountSuccess: boolean;
}

const SummonerLink = ({
  setDisplaySummonerLink,
  pageOtherThanHomePage,
  summonerAccountData,
  summonerName,
  isSummonerAccountSuccess,
  setSummonerName,
  setDisplaySummonerSections
}: Props) => {
  const markedRegionData = useAppSelector((state) => state.markedRegionData.markedRegionData);
  const { regionLink } = markedRegionData;

  const { data: summonerLevelAndIconIdData } = useQuery({
    enabled: !!summonerAccountData,
    queryKey: ['summonerLevelAndIconId', isSummonerAccountSuccess, summonerAccountData.puuid],
    queryFn: async () => {
      return await fetchApi<TSummonerProfile>(
        riotGamesRoutes.summonerProfile(summonerAccountData.puuid, regionLink)
      );
    }
  });

  const searchHistoryData: TLocalStorageSummoner = {
    regionShorthand: markedRegionData.shorthand,
    summonerName: summonerAccountData.gameName,
    tagLine: summonerAccountData.tagLine,
    summonerId: summonerLevelAndIconIdData?.id
  }

  const removeDuplicateObjects = (localeStorageArray: Array<TLocalStorageSummoner>): Array<TLocalStorageSummoner> => {
    return localeStorageArray.filter((value, index, self) => index === self.findIndex((t) => (
      t.summonerId === value.summonerId
    )));
  }

  const addSearchHistoryDataToLocalStorage = (): void => {
    const storageArray = getLocalStorageData(LocalStorageKeys.SearchHistory) || [];
    storageArray.unshift(searchHistoryData);
    const withoutDuplicates = removeDuplicateObjects(storageArray);
    localStorage.setItem(LocalStorageKeys.SearchHistory, JSON.stringify(withoutDuplicates));
  }

  return (
    <div className={`${summonerName.length > 0 ? 'block' : 'hidden'} ${pageOtherThanHomePage ? 'top-8 max-w-[472px]' : 'top-[3.2rem]'} absolute left-0 z-50 
    w-full bg-white dark:bg-darkMode-mediumGray rounded-b shadow-custom-shadow`}
    >
      <Link
        onClick={() => {
          addSearchHistoryDataToLocalStorage();
          setSummonerName('');
          setDisplaySummonerLink(false);
          setDisplaySummonerSections(false);
        }}
        className='flex items-center gap-2 py-1.5 px-4 transition-colors hover:bg-lightMode-lightGray dark:hover:bg-darkMode-darkGray rounded-b'
        href={`/summoners/${markedRegionData.shorthand.toLowerCase()}/${summonerAccountData.gameName}-${summonerAccountData.tagLine}`}
      >
        <Image
          className='w-9 rounded-full aspect-square'
          src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/profileicon/${summonerLevelAndIconIdData?.profileIconId}.png`}
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
            Level {summonerLevelAndIconIdData?.summonerLevel}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default SummonerLink;