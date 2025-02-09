import { useAppDispatch, useAppSelector } from '@/app/_hooks/useReduxHooks';
import { setLocalStorageFavoriteSummoners } from '@/app/_lib/features/localStorageFavoriteSummonersSlice';
import { getLocalStorageData } from '@/app/_utils/utils';
import type { TLocalStorageSummoner } from '@/app/_types/types';
import { LocalStorageKeys } from '@/app/_enums/enums';
import { FaStar, FaRegStar } from 'react-icons/fa';

type Props = {
  favoriteSummonerData: TLocalStorageSummoner;
  isSummonerAccountDataFetched: boolean;
}

const FavoriteSummonerButton = ({
  favoriteSummonerData,
  isSummonerAccountDataFetched,
}: Props) => {
  const summonerId = useAppSelector((state) => state.summonerId.summonerId);
  const localStorageFavoriteSummoners = useAppSelector((state) => state.localStorageFavoriteSummoners.localStorageFavoriteSummoners);
  const dispatch = useAppDispatch();

  const updateFavoriteSummoners = (favoriteSummonersArray: Array<TLocalStorageSummoner>): void => {
    localStorage.setItem('favoriteSummoners', JSON.stringify(favoriteSummonersArray));
    dispatch(setLocalStorageFavoriteSummoners(favoriteSummonersArray));
  }

  const toggleFavoriteSummoner = (): void => {
    const favoriteSummonersArray = getLocalStorageData(LocalStorageKeys.FavoriteSummoners) || [];
    const favoriteSummonerIndex = favoriteSummonersArray.findIndex((data) => (data.summonerId === summonerId));

    if (isSummonerAccountDataFetched) {
      if (favoriteSummonerIndex === -1) {
        favoriteSummonersArray.unshift(favoriteSummonerData);
        updateFavoriteSummoners(favoriteSummonersArray);
      } else {
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
      {checkSummonerFavoriteStatus() ? (
        <FaStar className='text-white' />
      ) : (
        <FaRegStar className='text-lightMode-secondLighterGray dark:text-darkMode-lighterGray' />
      )}
    </button>
  );
}

export default FavoriteSummonerButton;