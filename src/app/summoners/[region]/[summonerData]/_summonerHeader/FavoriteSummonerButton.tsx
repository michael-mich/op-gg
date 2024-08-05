import { useAppDispatch, useAppSelector } from '@/app/_lib/hooks/reduxHooks';
import { setLocalStorageFavoriteSummoners } from '@/app/_lib/features/localStorageFavoriteSummonersSlice';
import { getLocalStorageData } from '@/app/_lib/utils';
import { TSummonerProfile } from '@/app/_types/apiTypes';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import { FaStar, FaRegStar } from 'react-icons/fa';

type TProps = {
  favoriteSummonerData: TLocalStorageSummoner;
  fetchedSummonerAccountData: boolean;
  summonerProfileData: TSummonerProfile | undefined | void;
}

const FavoriteSummonerButton = ({
  favoriteSummonerData,
  fetchedSummonerAccountData,
  summonerProfileData
}: TProps) => {
  const localStorageFavoriteSummoners = useAppSelector((state) => state.localStorageFavoriteSummoners.localStorageFavoriteSummoners);
  const dispatch = useAppDispatch();

  const updateFavoriteSummoners = (favoriteSummonersArray: Array<TLocalStorageSummoner>): void => {
    localStorage.setItem('favoriteSummoners', JSON.stringify(favoriteSummonersArray));
    dispatch(setLocalStorageFavoriteSummoners(favoriteSummonersArray));
  }

  const toggleFavoriteSummoner = (): void => {
    const favoriteSummonersArray = getLocalStorageData('favoriteSummoners');
    const favoriteSummonerIndex = favoriteSummonersArray.findIndex((data) => (data.summonerId === summonerProfileData?.id));

    if (fetchedSummonerAccountData) {
      if (favoriteSummonerIndex === -1) {
        favoriteSummonersArray.unshift(favoriteSummonerData);
        updateFavoriteSummoners(favoriteSummonersArray);
      }
      else {
        favoriteSummonersArray.splice(favoriteSummonerIndex, 1);
        localStorage.setItem('favoriteSummoners', JSON.stringify(favoriteSummonersArray));
        updateFavoriteSummoners(favoriteSummonersArray);
      }
    }
  }

  const checkSummonerFavoriteStatus = () => {
    return localStorageFavoriteSummoners.some((summoner) => summoner.summonerId === favoriteSummonerData.summonerId);
  }

  return (
    <button
      onClick={toggleFavoriteSummoner}
      className={`${checkSummonerFavoriteStatus() && 'bg-[#e28400]'} rounded-md border border-[#edeff1] dark:border-[#393948] p-1`}
      type='button'
    >
      {checkSummonerFavoriteStatus()
        ?
        <FaStar className='text-white' />
        :
        <FaRegStar className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray' />
      }
    </button>
  );
}

export default FavoriteSummonerButton;