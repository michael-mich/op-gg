import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/app/_hooks/useReduxHooks';
import { useQuery } from '@tanstack/react-query';
import useOutsideClick from '@/app/_hooks/useOutsideClick';
import { fetchApi } from '@/app/_utils/fetchApi';
import { riotGamesRoutes } from '@/app/_constants/endpoints';
import type { TSummonerAccount } from '@/app/_types/apiTypes/apiTypes';
import type { TBooleanProp } from '../SearchSummoner';
import SummonerLink from './SummonerLink';
import SummonerSections from './summonerSections/SummonerSections';

const Search = ({ isHomePage }: TBooleanProp) => {
  const [summonerName, setSummonerName] = useState('');
  const [displaySummonerSections, setDisplaySummonerSections] = useState(false);
  const [displaySummonerLink, setDisplaySummonerLink] = useState(false);

  const summonerSectionsRef = useOutsideClick(displaySummonerSections, setDisplaySummonerSections);
  const markedRegionData = useAppSelector((state) => state.markedRegionData.markedRegionData);
  const { continentLink, shorthand } = markedRegionData;

  const {
    data: summonerAccountData,
    isError: isSummonerAccountError,
    isSuccess: isSummonerAccountSuccess,
    refetch: refetchSummonerAccountData,
    isFetching: isSummonerAccountFetching,
  } = useQuery({
    enabled: false,
    queryKey: ['searchSummoner'],
    queryFn: () => {
      return fetchApi<TSummonerAccount>(
        riotGamesRoutes.summonerAccount(summonerName, continentLink, shorthand)
      );
    }
  });

  const handleSummonerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSummonerName(e.target.value);
  }

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      refetchSummonerAccountData();
    }
  }

  useEffect(() => {
    if (isSummonerAccountError && !isSummonerAccountFetching) {
      setSummonerName('');
    }

    if (!isSummonerAccountFetching && isSummonerAccountSuccess) {
      setDisplaySummonerLink(true);
    }
  }, [
    isSummonerAccountError,
    isSummonerAccountFetching,
    isSummonerAccountSuccess,
    isSummonerAccountFetching
  ]);

  return (
    <div className={`${isHomePage ? 'flex items-center h-[60px] rounded-r-full bg-white dark:bg-darkMode-mediumGray pl-4 pr-8' : 'h-8 rounded-r bg-white pr-3'} flex justify-between w-full`}>
      <div ref={summonerSectionsRef} className={`${!isHomePage && 'pl-3'} relative w-full`}>
        <label
          className={`${isHomePage ? 'block' : 'hidden'} w-full text-xs font-bold cursor-pointer mb-1`}
          htmlFor='search-summoner'
        >
          Search
        </label>
        <div className='relative flex items-center'>
          <input
            onClick={() => setDisplaySummonerSections(true)}
            onFocus={() => setDisplaySummonerSections(true)}
            onChange={handleSummonerName}
            onKeyDown={handleKeyboardEvent}
            value={summonerName}
            autoComplete='off'
            className={`${isHomePage ? 'h-auto text-sm bg-white dark:bg-darkMode-mediumGray' : 'h-8 text-xs bg-white text-black'} 
            relative w-full outline-none`}
            type='text'
            id='search-summoner'
          />
          {(summonerName.length === 0 && !displaySummonerSections) && (
            <label
              className={`${isHomePage ? 'h-auto text-sm text-secondGray dark:text-mediumGrayText' : 'h-5 text-xs leading-5 text-secondGray'}
            absolute top-1/2 left-0 translate-y-[-50%] h-[20px] cursor-text`}
              htmlFor='search-summoner'
            >
              Game Name +
              {' '}
              <span className={`${isHomePage ? 'bg-lightMode-lightGray dark:bg-darkMode-darkGray' : 'bg-lightMode-lightGray'} rounded py-0.5 px-1`}>
                #{markedRegionData?.shorthand}
              </span>
            </label>
          )}
          {(isSummonerAccountError && displaySummonerSections) && (
            <label
              className={`${summonerName.length > 0 && 'hidden'} 
              ${isHomePage ? 'text-base' : 'text-xs'}
              absolute top-1/2 translate-y-[-50%] left-0 text-red cursor-text`}
              htmlFor='search-summoner'
            >
              Invalid summoner name
            </label>
          )}
        </div>
        {((displaySummonerLink || isSummonerAccountFetching) && !isSummonerAccountError) && (
          <SummonerLink
            setDisplaySummonerLink={setDisplaySummonerLink}
            isHomePage={isHomePage}
            summonerAccountData={summonerAccountData}
            summonerName={summonerName}
            setSummonerName={setSummonerName}
            setDisplaySummonerSections={setDisplaySummonerSections}
            isSummonerAccountFetching={isSummonerAccountFetching}
          />
        )}
        {(summonerName === '' && displaySummonerSections) && (
          <SummonerSections
            isHomePage={isHomePage}
            setDisplaySummonerSections={setDisplaySummonerSections}
          />
        )}
      </div>
      <button
        onClick={() => refetchSummonerAccountData()}
        type='button'
      >
        <Image
          className={`${isHomePage ? 'w-16' : 'w-12 max-h-8'}`}
          src='/company-logo/blue-logo.svg'
          width={50}
          height={50}
          alt=''
        />
      </button>
    </div>
  );
}

export default Search;